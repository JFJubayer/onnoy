<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0" 
                xmlns:html="http://www.w3.org/TR/REC-html40"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap — Onnoy-অন্বয়</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <style type="text/css">
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            color: #333;
            margin: 0;
            padding: 40px;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 900px;
            margin: 0 auto;
            background: #fff;
            padding: 30px 40px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.05);
          }
          h1 {
            color: #1A6B3A;
            font-size: 26px;
            margin-top: 0;
            margin-bottom: 8px;
          }
          p.desc {
            color: #666;
            font-size: 14px;
            margin-bottom: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            font-size: 14px;
          }
          th {
            text-align: left;
            padding: 12px 10px;
            border-bottom: 2px solid #e9ecef;
            color: #495057;
            font-weight: 600;
          }
          td {
            padding: 12px 10px;
            border-bottom: 1px solid #e9ecef;
          }
          tr:hover td {
            background-color: #f8f9fa;
          }
          a {
            color: #1A6B3A;
            text-decoration: none;
            font-weight: 500;
          }
          a:hover {
            text-decoration: underline;
          }
          .priority {
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            background: #e8f5e9;
            color: #2e7d32;
            font-weight: 600;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Onnoy-অন্বয় XML Sitemap</h1>
          <p class="desc">This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)"/> URLs and is formatted for both human readability and search engine indexing (Google Search Console).</p>
          <table>
            <thead>
              <tr>
                <th>Page URL</th>
                <th>Last Modified</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <xsl:variable name="itemURL">
                      <xsl:value-of select="sitemap:loc"/>
                    </xsl:variable>
                    <a href="{$itemURL}" target="_blank">
                      <xsl:value-of select="sitemap:loc"/>
                    </a>
                  </td>
                  <td><xsl:value-of select="sitemap:lastmod"/></td>
                  <td><span class="priority"><xsl:value-of select="sitemap:priority"/></span></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
