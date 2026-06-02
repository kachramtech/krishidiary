import fs from "fs";
import path from "path";

try {
  const distPath = path.join(process.cwd(), "dist");
  const htmlPath = path.join(distPath, "index.html");

  if (!fs.existsSync(htmlPath)) {
    console.error("Vite index.html not found! Run build first.");
    process.exit(1);
  }

  let htmlContent = fs.readFileSync(htmlPath, "utf8");

  // Inline JavaScript
  const scriptRegex = /<script type="module" crossorigin src="([^"]+)"><\/script>/;
  const scriptMatch = htmlContent.match(scriptRegex);

  if (scriptMatch) {
    const scriptUrl = scriptMatch[1];
    const scriptPath = path.join(distPath, scriptUrl);
    if (fs.existsSync(scriptPath)) {
      console.log("Inlining script:", scriptUrl);
      const jsContent = fs.readFileSync(scriptPath, "utf8");
      // Replace with inlined script tag, ensuring we don't trigger inline parsing bugs
      htmlContent = htmlContent.replace(
        scriptMatch[0],
        `<script type="module">\n${jsContent}\n</script>`
      );
    }
  }

  // Inline CSS
  const cssRegex = /<link rel="stylesheet" crossorigin href="([^"]+)">/;
  const cssMatch = htmlContent.match(cssRegex);

  if (cssMatch) {
    const cssUrl = cssMatch[1];
    const cssPath = path.join(distPath, cssUrl);
    if (fs.existsSync(cssPath)) {
      console.log("Inlining CSS:", cssUrl);
      const cssContent = fs.readFileSync(cssPath, "utf8");
      htmlContent = htmlContent.replace(
        cssMatch[0],
        `<style>\n${cssContent}\n</style>`
      );
    }
  }

  // Save the standalone index.html
  const outputPath = path.join(process.cwd(), "index_single.html");
  fs.writeFileSync(outputPath, htmlContent, "utf8");
  console.log("✓ Perfectly bundled single file index.html created at /index_single.html");
} catch (error) {
  console.error("Failed to inline assets:", error);
  process.exit(1);
}
