import * as fs from 'fs'

const Sitemap = () => {
  return null
}

function getAllProducts() {
  return [{
    id: '1',
    name: 'MacBook Pro',
    price: 129900
  }, {
    id: '2',
    name: 'iPhone 13 Mini',
    price: 79490
  }, {
    id: '3',
    name: 'iPhone 13 Pro',
    price: 99990
  }]
}

export async function getServerSideProps({ res }) {
  const BASE_URL = 'https://sitemap-demo-two.vercel.app'

  const products = getAllProducts() // Здесь может быть вызов с любого API

  // тут будуть додаватися динамічні шляхи
  const dynamicPaths = products.map(singleProduct => {
    return `${BASE_URL}/product/${singleProduct.id}`
  })

  const staticPaths = fs
    .readdirSync(__dirname)
    .filter(staticPage => {
      return ![
        "api",
        "_app.tsx",
        "_document.tsx",
        "404.tsx",
        "sitemap.xml.tsx",
      ].includes(staticPage)
    })
    .map(staticPagePath => {
      return `${BASE_URL}/${staticPagePath.split('.')[0]}`
    })

  const allPaths = [...staticPaths, ...dynamicPaths]

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${allPaths.map(url => (
    `<url>
          <loc>${url}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>monthly</changefreq>
          <priority>1.0</priority>
        </url>`
  )).join("")}
    </urlset>
  `

  res.setHeader('Content-Type', 'text/xml')
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default Sitemap