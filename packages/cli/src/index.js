import { program } from "commander";
import prompts from "prompts";
import { cyan, green, yellow, red, dim } from "kolorist";
import { mkdir, writeFile, readdir, readFile } from "fs/promises";
import { existsSync } from "fs";
import { join, dirname } from "path";
import { realpathSync } from "fs";

// 兼容 ESM 与 CJS 输出，通过 process.argv[1] 定位脚本目录
const scriptPath = process.argv[1];
const realPath = scriptPath ? realpathSync(scriptPath) : process.cwd();
const TEMPLATES_DIR = join(dirname(realPath), "..", "templates");

const TEMPLATES = [
  { value: "html", name: "HTML（纯前端，零依赖）", desc: "无需构建，开箱即用" },
  { value: "nodejs-stdio", name: "Node.js stdio", desc: "每次调用 spawn 新进程" },
  { value: "nodejs-http", name: "Node.js HTTP", desc: "长连接，适合高频调用" },
  { value: "python-stdio", name: "Python stdio", desc: "Python 后端" },
  { value: "python-http", name: "Python HTTP", desc: "Python 长连接" },
  { value: "go-stdio", name: "Go stdio", desc: "Go 后端" },
  { value: "go-http", name: "Go HTTP", desc: "Go 长连接" },
  { value: "vue", name: "Vue 3 + Vite + TypeScript", desc: "纯 Vue，零 CodeExpander 依赖" },
  { value: "react", name: "React + Vite（需 monorepo）", desc: "dev-tools-ui，在 codeexpander-plugins 仓库内开发" },
  { value: "react-standalone", name: "React + Vite（独立项目）", desc: "需 @codeexpander/* 已发布到 npm" },
];

function interpolate(str, vars) {
  return str.replace(/\{\{([\w-]+)\}\}/g, (_, key) => vars[key] ?? "");
}

const TEXT_EXT = new Set([".js", ".ts", ".tsx", ".vue", ".json", ".html", ".css", ".md", ".yaml", ".yml", ".go", ".py", ".rb", ".php", ".sh"]);
async function copyTemplate(templateDir, targetDir, vars) {
  const entries = await readdir(templateDir, { withFileTypes: true });
  for (const entry of entries) {
    const src = join(templateDir, entry.name);
    const destName = interpolate(entry.name, vars);
    const dest = join(targetDir, destName);
    if (entry.isDirectory()) {
      await mkdir(dest, { recursive: true });
      await copyTemplate(src, dest, vars);
    } else {
      await mkdir(dirname(dest), { recursive: true });
      const ext = entry.name.slice(entry.name.lastIndexOf("."));
      const isText = TEXT_EXT.has(ext);
      let content = await readFile(src, isText ? "utf-8" : null);
      if (isText) content = interpolate(content, vars);
      await writeFile(dest, content);
    }
  }
}

program
  .name("create-codeexpander-plugin")
  .description("一键初始化 CodeExpander 插件，支持多种技术栈")
  .argument("[project-name]", "项目/插件名称，如 my-plugin")
  .option("-t, --template <name>", `模板: ${TEMPLATES.map((t) => t.value).join(", ")}`)
  .option("-y, --yes", "跳过交互，使用默认值")
  .action(async (projectName, opts) => {
    console.log(cyan("\n  create-codeexpander-plugin\n"));
    let name = projectName;
    let template = opts.template;

    if (!opts.yes) {
      const res = await prompts([
        {
          type: name ? null : "text",
          name: "name",
          message: "插件名称（如 my-plugin）",
          initial: "my-plugin",
          validate: (v) => (v ? true : "请输入名称"),
        },
        {
          type: template ? null : "select",
          name: "template",
          message: "选择技术栈",
          choices: TEMPLATES.map((t) => ({ title: `${t.name} - ${t.desc}`, value: t.value })),
          initial: 0,
        },
      ]);
      name = name || res.name;
      template = template || res.template;
    }

    name = name || "my-plugin";
    template = template || "html";
    const templateDir = join(TEMPLATES_DIR, template);
    if (!existsSync(templateDir)) {
      console.error(red(`\n模板不存在: ${template}\n可用: ${TEMPLATES.map((t) => t.value).join(", ")}\n`));
      process.exit(1);
    }

    const targetDir = join(process.cwd(), name);
    if (existsSync(targetDir)) {
      console.error(red(`\n目录已存在: ${targetDir}\n`));
      process.exit(1);
    }

    const pkgName = name.startsWith("@") ? name : `@codeexpander/plugin-${name.replace(/^plugin-/, "")}`;
    const title = name
      .replace(/^plugin-/, "")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const vars = {
      "project-name": name,
      "project-name-kebab": name.replace(/_/g, "-"),
      "package-name": pkgName,
      title,
      template,
    };

    console.log(dim(`  创建 ${name} (${template})...\n`));
    await mkdir(targetDir, { recursive: true });
    await copyTemplate(templateDir, targetDir, vars);
    console.log(green("  ✓ 创建完成\n"));
    console.log(yellow("  下一步:\n"));
    console.log(`    cd ${name}`);
    if (template === "vue" || template === "react" || template === "react-standalone") {
      console.log("    pnpm install");
      console.log("    pnpm dev\n");
    } else {
      console.log("    # 在 CodeExpander 中导入此目录即可\n");
    }
  });

program.parse();
