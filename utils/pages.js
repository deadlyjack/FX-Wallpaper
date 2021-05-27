/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const files = [
  'hbs',
  'js',
  'include.js',
  'scss',
];

const action = process.argv[2];
const name = process.argv[3];
const pagePath = path.resolve(__dirname, '../src/pages/');
const id = (new Date().getTime() + parseInt(Math.random() * 100000000000, 10)).toString(36);

if (!action) {
  console.error('Action is required');
  process.exit(1);
} else if (!['add', 'remove'].includes(action)) {
  console.error('Invalid action');
  process.exit(1);
}

if (!name) {
  console.error('Page name is required.');
  process.exit(1);
} else if (!/^[a-z]+[a-z0-9_]+/i.test(name)) {
  console.error('Invalid page name');
  process.exit(1);
}

const page = path.join(pagePath, name);
const classname = name[0].toUpperCase() + name.slice(1);

const content = {
  hbs: '',
  scss: `#${id}{\n  position: relative;\n}`,
  js: `export default function ${classname}(...args) {\n  import(/* webpackChunkName: "${name}" */ './${name}.include')\n    .then((module) => {\n      const ${name} = module.default;\n      ${name}(...args);\n    });\n}\n`,
  'include.js': `import './${name}.scss';\nimport page from './${name}.hbs';\nimport Page from '../../components/page/page';\n\nexport default function ${classname}Include() {\n  const $page = Page('${classname}', {\n    id: '${id}',\n    secondary: true,\n  });\n  $page.content = page;\n  $page.render();\n}\n`,
};

if (action === 'remove') {
  if (fs.existsSync(page)) {
    fs.rmdirSync(page, {
      recursive: true,
    });
  }

  console.log('Page removed successfully.');
} else if (action === 'add') {
  fs.mkdirSync(page);
  files.forEach((file) => {
    const filePath = path.join(page, [name, file].join('.'));
    fs.writeFileSync(filePath, content[file], 'utf8');
  });

  console.log('Page added successfully.');
}
