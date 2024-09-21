const express = require('express');
const cors = require('cors');
const puppeteer = require('puppeteer-core'); // Using puppeteer-core
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 2000;

app.use(cors());
app.use(express.json());

// Function to get Chromium executable path
const getBrowser = async () => {
  // Option 1: Using puppeteer to get Chromium path
  const puppeteerPackage = require('puppeteer'); // Ensure puppeteer is installed
  const browser = await puppeteerPackage.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  return browser;

  // Option 2: Specify path to existing Chrome installation
  /*
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: '/path/to/your/chrome', // e.g., '/usr/bin/google-chrome' or 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  return browser;
  */
};

// Utility function to clean text by removing extra whitespace and escape characters
const cleanText = (text) => {
  return text.replace(/\s+/g, ' ').replace(/[\n\r\t]/g, ' ').trim();
};

// Endpoint to handle scraping
app.post('/scrape', async (req, res) => {
  const { urls } = req.body;

  if (!urls || !Array.isArray(urls) || urls.length === 0) {
    return res.status(400).json({ error: 'Please provide a non-empty array of URLs.' });
  }

  let browser;

  try {
    browser = await getBrowser();

    const scrapePromises = urls.map(async (url) => {
      const page = await browser.newPage();

      try {
        // Set a reasonable timeout
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });

        // Extract data
        const data = await page.evaluate(() => {
          const getText = (selector) => {
            const elements = Array.from(document.querySelectorAll(selector));
            return elements.map(el => el.innerText.trim());
          };

          const getLinks = () => {
            const anchors = Array.from(document.querySelectorAll('a[href]'));
            return anchors.map(a => ({ text: a.innerText.trim(), href: a.href }));
          };

          const getHeadings = () => {
            const headings = {};
            for (let i = 1; i <= 6; i++) {
              const elems = Array.from(document.querySelectorAll(`h${i}`));
              headings[`h${i}`] = elems.map(el => el.innerText.trim());
            }
            return headings;
          };

          const getTables = () => {
            const tables = Array.from(document.querySelectorAll('table')).map(table => {
              const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.trim());
              const rows = Array.from(table.querySelectorAll('tr')).map(tr => {
                const cells = Array.from(tr.querySelectorAll('td')).map(td => td.innerText.trim());
                return cells;
              });
              return { headers, rows };
            });
            return tables;
          };

          // Remove unwanted elements
          const unwantedSelectors = ['script', 'style', 'svg', 'noscript', 'iframe', 'header', 'footer', 'nav', 'img'];
          unwantedSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => el.remove());
          });

          return {
            paragraphs: getText('p'),
            headings: getHeadings(),
            links: getLinks(),
            tables: getTables(),
            // Images are excluded as per requirements
          };
        });

        // Clean extracted data
        const cleanedData = {
          url,
          paragraphs: data.paragraphs.map(cleanText),
          headings: Object.fromEntries(
            Object.entries(data.headings).map(([key, values]) => [key, values.map(cleanText)])
          ),
          links: data.links.map(link => ({
            text: cleanText(link.text),
            href: link.href,
          })),
          tables: data.tables.map(table => ({
            headers: table.headers.map(cleanText),
            rows: table.rows.map(row => row.map(cleanText)),
          })),
        };

        await page.close();
        return { success: true, data: cleanedData };
      } catch (error) {
        await page.close();
        return { success: false, error: error.message };
      }
    });

    const results = await Promise.all(scrapePromises);

    // Close the browser after all scraping is done
    await browser.close();

    res.json({ results });
  } catch (error) {
    if (browser) await browser.close();
    console.error('Scraping Error:', error);
    res.status(500).json({ error: 'An error occurred while scraping.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
