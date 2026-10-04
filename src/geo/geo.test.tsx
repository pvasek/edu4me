import { renderToStaticMarkup } from 'react-dom/server'
import { beforeAll, describe, expect, it } from 'vitest'
import type { MapLayer } from '../core/types'
import { COUNTRY_NAMES, CZ_REGION_NAMES } from './codes'
import { FIGURE_FRAMES, getView, invert, project, resolveView, unwrap } from './frame'
import { GeoMap, latLabel, lonLabel, mapLabel } from './GeoMap'
import { loadPlates, loadView, peekView } from './load'
import { makeProjection, type ProjectionKind } from './project'
import { countryAt, labelPoint, regionAt } from './query'
import { MAP_VIEW_IDS, VIEW_DEFS } from './views'

beforeAll(async () => {
  await Promise.all(MAP_VIEW_IDS.map((v) => loadView(v)))
  await loadPlates()
})

describe('projections', () => {
  const kinds: [ProjectionKind, number?][] = [['equal-earth'], ['mercator'], ['natural-earth'], ['robinson'], ['laea', 50], ['laea', 90], ['laea', -90]]
  for (const [kind, lat0] of kinds)
    it(`${kind}${lat0 !== undefined ? ' ' + lat0 : ''}: forward → inverse round trip`, () => {
      const p = makeProjection({ kind, lon0: 15, lat0 })
      for (let lat = -80; lat <= 80; lat += 10)
        for (let lon = -165; lon <= 195; lon += 15) {
          if (kind === 'laea' && lat0 !== undefined && Math.abs(lat0) === 90 && lat * lat0 < 0 && Math.abs(lat) > 60) continue
          const [x, y] = p.forward(lon, lat)
          const back = p.inverse(x, y)
          expect(back).not.toBeNull()
          expect(back![1]).toBeCloseTo(lat, 5)
          if (Math.abs(lat) < 89) expect(unwrap(back![0], lon)).toBeCloseTo(lon, 5)
        }
    })
  it('every view: project and invert agree inside the frame', () => {
    for (const v of MAP_VIEW_IDS) {
      const g = getView(v)
      for (const [fx, fy] of [[0.3, 0.4], [0.5, 0.5], [0.7, 0.6]]) {
        const ll = invert(v, fx * 1000, fy * g.H)
        expect(ll, v).not.toBeNull()
        const [x, y] = project(v, ll!.lon, ll!.lat)
        expect(x).toBeCloseTo(fx * 1000, 4)
        expect(y).toBeCloseTo(fy * g.H, 4)
      }
    }
  })
  it("the frame lies inside each view's data clip box", () => {
    for (const v of MAP_VIEW_IDS) {
      const g = getView(v)
      for (let i = 0; i <= 40; i++)
        for (const [x, y] of [[i * 25, 0], [i * 25, g.H], [0, (i * g.H) / 40], [1000, (i * g.H) / 40]]) {
          const ll = invert(v, x, y)
          if (!ll) continue
          const lon = unwrap(ll.lon, g.lonC)
          expect(ll.lat >= g.clip[1] && ll.lat <= g.clip[3], `${v} lat ${ll.lat}`).toBe(true)
          expect(lon >= g.clip[0] && lon <= g.clip[2], `${v} lon ${lon}`).toBe(true)
        }
    }
  })
  it('Czech coordinate labels', () => {
    expect(latLabel(30)).toBe('30° s. š.')
    expect(latLabel(-23 - 26 / 60)).toBe('23° 26′ j. š.')
    expect(lonLabel(15)).toBe('15° v. d.')
    expect(lonLabel(-120)).toBe('120° z. d.')
    expect(lonLabel(0)).toBe('0°')
    expect(lonLabel(-180)).toBe('180°')
  })
})

describe('codes and data', () => {
  it('every code in codes.ts is in the world data and vice versa', () => {
    const world = peekView('world')!
    expect([...world.countries.keys()].sort()).toEqual(Object.keys(COUNTRY_NAMES).sort())
    for (const c of Object.keys(COUNTRY_NAMES)) expect(world.labels[c], c).toBeDefined()
  })
  it('regional modules only use known codes; czechia has all 14 regions', () => {
    for (const v of MAP_VIEW_IDS) for (const c of peekView(v)!.countries.keys()) expect(COUNTRY_NAMES[c], `${v}: ${c}`).toBeDefined()
    expect([...peekView('czechia')!.regions.keys()].sort()).toEqual(Object.keys(CZ_REGION_NAMES).sort())
  })
  it('curated Czech names', () => {
    expect(COUNTRY_NAMES.COD).toBe('Demokratická republika Kongo')
    expect(COUNTRY_NAMES.COG).toBe('Kongo')
    expect(COUNTRY_NAMES.CZE).toBe('Česko')
    expect(COUNTRY_NAMES.MKD).toBe('Severní Makedonie')
    expect(COUNTRY_NAMES.SWZ).toBe('Eswatini')
    expect(COUNTRY_NAMES.MMR).toBe('Myanmar')
    for (const n of Object.values(COUNTRY_NAMES)) expect(n).not.toMatch(/ – |\(Barma\)|ZAO/)
  })
  it('the main rivers carry Czech names', () => {
    const names = (v: (typeof MAP_VIEW_IDS)[number]) => new Set(peekView(v)!.rivers.map((r) => r.name))
    const cz = names('czechia')
    for (const r of ['Vltava', 'Labe', 'Morava', 'Odra', 'Dyje', 'Ohře', 'Sázava', 'Svratka']) expect(cz.has(r), r).toBe(true)
    const eu = names('europe')
    for (const r of ['Dunaj', 'Rýn', 'Visla', 'Volha', 'Labe']) expect(eu.has(r), r).toBe(true)
    const w = names('world')
    for (const r of ['Nil', 'Amazonka', 'Mississippi', "Jang-c'-ťiang"]) expect(w.has(r), r).toBe(true)
  })
})

describe('hit tests', () => {
  it('finds the state under a city', () => {
    for (const v of ['world', 'europe', 'central-europe'] as const) {
      expect(countryAt(v, 14.42, 50.09), v).toBe('CZE')
      expect(countryAt(v, 13.4, 52.52), v).toBe('DEU')
      expect(countryAt(v, 16.37, 48.21), v).toBe('AUT')
    }
    expect(countryAt('czechia', 14.42, 50.09)).toBe('CZE')
    expect(countryAt('world', 28.3, -29.6)).toBe('LSO')
    expect(countryAt('africa', 28.3, -29.6)).toBe('LSO')
    expect(countryAt('africa', 25, -29)).toBe('ZAF')
    // the Vatican is smaller than one quantisation step: it keeps its code and label point (drawn as a marker)
    expect(peekView('europe')!.countries.has('VAT')).toBe(true)
    expect(peekView('europe')!.labels.VAT).toBeDefined()
    expect(countryAt('europe', 12.5, 41.9)).toBe('ITA')
    expect(countryAt('world', 0, 0)).toBeUndefined()
    // across the antimeridian
    expect(countryAt('oceania', 178.4, -17.8)).toBe('FJI')
    expect(countryAt('world', -173, 66.3)).toBe('RUS')
    expect(countryAt('asia', -173, 66.3)).toBe('RUS')
    expect(countryAt('arctic', -173, 66.3)).toBe('RUS')
  })
  it('finds the Czech region', () => {
    expect(regionAt(16.61, 49.2)).toBe('CZ-64')
    expect(regionAt(14.42, 50.09)).toBe('CZ-10')
    expect(regionAt(18.29, 49.84)).toBe('CZ-80')
  })
  it('label points', () => {
    const p = labelPoint('CZE')!
    expect(countryAt('world', p[0], p[1])).toBe('CZE')
  })
})

const svgOf = (html: string) => {
  expect(html).toContain('<svg')
  expect(html).toContain('role="img"')
  expect(html).not.toMatch(/NaN|undefined|Infinity/)
  return /aria-label="([^"]+)"/.exec(html)?.[1] ?? ''
}

describe('GeoMap renders every view', () => {
  const all: MapLayer[] = ['graticule', 'graticule-labels', 'tropics', 'rivers', 'lakes', 'plates', 'timezones', 'names']
  for (const v of MAP_VIEW_IDS)
    it(v, () => {
      const html = renderToStaticMarkup(
        <GeoMap
          view={v}
          layers={v === 'czechia' ? [...all, 'regions'] : all}
          highlight={[{ codes: v === 'czechia' ? ['CZ-64'] : ['CZE', 'VAT', 'FJI'], tone: 'b', label: 'zvýraznění' }]}
          points={[{ lat: 50.09, lon: 14.42, label: 'Praha', kind: 'capital' }, { lat: 49.2, lon: 16.61, label: 'Brno', kind: 'city' }]}
          routes={[{ points: [{ lat: 50.09, lon: 14.42 }, { lat: 35.68, lon: 139.69 }], label: 'let', arrow: true }]}
          bands={[{ from: -23.44, to: 23.44, label: 'tropy' }]}
        />,
      )
      const label = svgOf(html)
      expect(label.startsWith(VIEW_DEFS[v].title)).toBe(true)
      expect(html).toContain('class="geo-coast"')
      expect(html.length).toBeGreaterThan(5000)
    })
  it('aria label lists the content', () => {
    const l = mapLabel({ view: 'europe', highlight: [{ codes: ['CZE', 'SVK'], label: 'V4' }], points: [{ lat: 50, lon: 14, label: 'Praha' }], layers: ['rivers'] })
    expect(l).toBe('Mapa Evropy: zvýrazněno (V4) Česko, Slovensko; body: Praha; vrstvy: řeky.')
  })
  it('custom figure frames pick a data module and render', () => {
    const g = resolveView(FIGURE_FRAMES['north-atlantic'])
    expect(g).toBe(resolveView({ ...FIGURE_FRAMES['north-atlantic'] }))
    expect(MAP_VIEW_IDS).toContain(g.dataView)
    const html = renderToStaticMarkup(<GeoMap view={FIGURE_FRAMES['north-atlantic']} layers={['graticule']} />)
    svgOf(html)
    expect(countryAt(FIGURE_FRAMES['north-atlantic'], -21.9, 64.1)).toBe('ISL')
  })
})

describe('data modules load lazily', () => {
  it('nothing outside src/geo/load.ts imports src/geo/data', () => {
    const files = import.meta.glob(['/src/**/*.{ts,tsx}', '!/src/geo/data/**', '!/src/**/*.test.{ts,tsx}'], {
      query: '?raw',
      import: 'default',
      eager: true,
    }) as Record<string, string>
    expect(Object.keys(files).length).toBeGreaterThan(50)
    const offenders = Object.entries(files)
      .filter(([path]) => path !== '/src/geo/load.ts')
      .filter(([path, src]) => /['"][^'"]*geo\/data\//.test(src) || (path.startsWith('/src/geo/') && /['"]\.\/data\//.test(src)))
      .map(([path]) => path)
    expect(offenders).toEqual([])
    // and load.ts reaches them only through dynamic imports
    expect(files['/src/geo/load.ts']).not.toMatch(/^import [^(]*['"]\.\/data\//m)
    expect(files['/src/geo/load.ts']).toMatch(/import\('\.\/data\/world'\)/)
  })
})
