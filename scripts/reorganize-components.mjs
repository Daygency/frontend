import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve("src/components");

const categories = {
  ui: [
    "Tag",
    "NewBadge",
    "Logo",
    "HighlightText",
    "SelectableTag",
    "Section",
    "FabButton",
  ],
  cards: [
    "GrayCard",
    "ArtistCard",
    "AgencyCard",
    "VenueCard",
    "ReviewCard",
    "AnnouncementCard",
    "EventNewsCard",
    "RentalNewsCard",
    "ShadowCardButton",
  ],
  forms: [
    "Form",
    "FormTextInput",
    "FormDropdownInput",
    "FormField",
    "OneLineTextInput",
  ],
  layout: [
    "MainHomeHeader",
    "MainHomeTopBar",
    "CategoryTabBar",
    "AllContentScene",
    "SignupFlowProgress",
  ],
  lists: ["ShadowCardList"],
  media: ["ImageCarousel", "ImageScrollView"],
  comments: ["CommentInputBar", "CommentAuthorAvatar"],
  modals: [
    "MajorTagSelectModal",
    "SectorTagSelectModal",
    "ReportCategoryModal",
    "MajorTagFilter",
  ],
  menus: [
    "ReportDotsDropdownMenu",
    "PostDetailOptionsMenu",
    "FilterDropdown",
  ],
  icons: ["ArtistIcon", "AgencyIcon"],
  shared: ["AnnouncementShared"],
};

const componentToCategory = Object.fromEntries(
  Object.entries(categories).flatMap(([category, names]) =>
    names.map((name) => [name, category]),
  ),
);

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else if (/\.(ts|tsx)$/.test(entry.name)) {
      files.push(fullPath);
    }
  }
  return files;
}

function moveComponents() {
  fs.mkdirSync(path.join(root, "internal"), { recursive: true });

  const bridgePath = path.join(root, "FcmTokenSyncBridge.tsx");
  if (fs.existsSync(bridgePath)) {
    fs.renameSync(
      bridgePath,
      path.join(root, "internal", "FcmTokenSyncBridge.tsx"),
    );
  }

  for (const [category, names] of Object.entries(categories)) {
    const categoryDir = path.join(root, category);
    fs.mkdirSync(categoryDir, { recursive: true });

    for (const name of names) {
      const from = path.join(root, name);
      const to = path.join(categoryDir, name);
      if (fs.existsSync(from)) {
        fs.renameSync(from, to);
      }
    }
  }
}

function createIndexFiles() {
  for (const [category, names] of Object.entries(categories)) {
    for (const name of names) {
      const componentDir = path.join(root, category, name);
      if (!fs.existsSync(componentDir)) continue;

      const mainFile = fs
        .readdirSync(componentDir)
        .find((file) => /^[A-Z].*\.tsx$/.test(file) && !file.includes(".stories."));

      if (!mainFile) continue;

      const indexPath = path.join(componentDir, "index.ts");
      const exportName = mainFile.replace(/\.tsx$/, "");
      fs.writeFileSync(
        indexPath,
        `export { default } from "./${exportName}";\n`,
      );
    }
  }

  fs.writeFileSync(
    path.join(root, "internal", "index.ts"),
    'export { FcmTokenSyncBridge } from "./FcmTokenSyncBridge";\n',
  );
}

function updateImportsInFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  let changed = false;

  const replace = (pattern, replacement) => {
    const next = content.replace(pattern, replacement);
    if (next !== content) {
      content = next;
      changed = true;
    }
  };

  if (filePath.startsWith(root)) {
    replace(/from "\.\.\/\.\.\/color"/g, 'from "../../../color"');
    replace(/from "\.\.\/\.\.\/lib\//g, 'from "../../../lib/');
    replace(/from "\.\.\/\.\.\/contexts\//g, 'from "../../../contexts/');
    replace(/from "\.\.\/\.\.\/navigations\//g, 'from "../../../navigations/');
    replace(/from "\.\.\/\.\.\/screens\//g, 'from "../../../screens/');
    replace(/from "\.\.\/\.\.\/\.\.\/assets\//g, 'from "../../../../assets/');

    for (const [name, category] of Object.entries(componentToCategory)) {
      replace(
        new RegExp(`from "\\.\\./${name}/${name}"`, "g"),
        `from "../../${category}/${name}"`,
      );
      replace(
        new RegExp(`from "\\.\\./${name}/styles"`, "g"),
        `from "../../${category}/${name}/styles"`,
      );
      replace(
        new RegExp(`from "\\.\\./${name}/constants"`, "g"),
        `from "../../${category}/${name}/constants"`,
      );
      replace(
        new RegExp(`from "\\.\\./AnnouncementShared/sharedAnnouncementStyles"`, "g"),
        `from "../../shared/AnnouncementShared/sharedAnnouncementStyles"`,
      );
    }
  } else if (filePath.includes("/src/")) {
    for (const [name, category] of Object.entries(componentToCategory)) {
      replace(
        new RegExp(
          `from "(\\.\\./)+components/${name}/${name}"`,
          "g",
        ),
        (match) => {
          const prefix = match.match(/(\.\.\/)+/)[0];
          return `from "${prefix}components/${category}/${name}"`;
        },
      );
      replace(
        new RegExp(`from "(\\.\\./)+components/${name}/styles"`, "g"),
        (match) => {
          const prefix = match.match(/(\.\.\/)+/)[0];
          return `from "${prefix}components/${category}/${name}/styles"`;
        },
      );
      replace(
        new RegExp(`from "(\\.\\./)+components/${name}/constants"`, "g"),
        (match) => {
          const prefix = match.match(/(\.\.\/)+/)[0];
          return `from "${prefix}components/${category}/${name}/constants"`;
        },
      );
    }

    replace(
      /from "\.\/components\/FcmTokenSyncBridge"/g,
      'from "./components/internal/FcmTokenSyncBridge"',
    );
    replace(
      /from "(\.\.\/)+components\/FcmTokenSyncBridge"/g,
      (match) => match.replace("/components/FcmTokenSyncBridge", "/components/internal/FcmTokenSyncBridge"),
    );
    replace(
      /from "\.\.\/\.\.\/components\/AnnouncementShared\/sharedAnnouncementStyles"/g,
      'from "../../components/shared/AnnouncementShared/sharedAnnouncementStyles"',
    );
    replace(
      /from "\.\.\/\.\.\/\.\.\/components\/AnnouncementShared\/sharedAnnouncementStyles"/g,
      'from "../../../components/shared/AnnouncementShared/sharedAnnouncementStyles"',
    );
    replace(
      /from "\.\.\/\.\.\/\.\.\/\.\.\/components\/AnnouncementShared\/sharedAnnouncementStyles"/g,
      'from "../../../../components/shared/AnnouncementShared/sharedAnnouncementStyles"',
    );
  }

  if (changed) {
    fs.writeFileSync(filePath, content);
  }
}

moveComponents();
createIndexFiles();

const files = [
  ...walk(root),
  ...walk(path.resolve("src/screens")),
  path.resolve("src/App.tsx"),
].filter((file) => fs.existsSync(file));

for (const file of files) {
  updateImportsInFile(file);
}

execSync("npx sb-rn-get-stories", { stdio: "inherit" });

console.log("Component reorganization complete.");
