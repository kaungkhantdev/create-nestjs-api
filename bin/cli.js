#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const projectName = args[0];

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function showHelp() {
  console.log(`
Usage: npx create-nestjs-api <project-name>

Options:
  -h, --help      Show help
  -v, --version   Show version

Example:
  npx create-nestjs-api my-app
  `);
}

// Handle flags
if (!projectName || args.includes('-h') || args.includes('--help')) {
  showHelp();
  process.exit(0);
}

if (args.includes('-v') || args.includes('--version')) {
  const pkg = require('../package.json');
  console.log(pkg.version);
  process.exit(0);
}

// Validate project name
if (!/^[a-zA-Z0-9-_]+$/.test(projectName)) {
  log('Error: Project name can only contain letters, numbers, hyphens, and underscores.', 'red');
  process.exit(1);
}

const targetPath = path.join(process.cwd(), projectName);

// Check if directory already exists
if (fs.existsSync(targetPath)) {
  log(`Error: Directory "${projectName}" already exists.`, 'red');
  process.exit(1);
}

async function main() {
  try {
    log(`\n🚀 Creating NestJS API project: ${projectName}\n`, 'cyan');

    // Clone template using degit
    log('📦 Downloading template...', 'yellow');
    execSync(`npx degit kaungkhantdev/nestjs-api-starter ${projectName}`, {
      stdio: 'inherit',
    });

    // Update package.json with new project name
    const pkgPath = path.join(targetPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.name = projectName;
      pkg.version = '0.0.1';
      pkg.description = '';
      pkg.author = '';
      pkg.repository = undefined;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    log('\n✅ Project created successfully!\n', 'green');
    log('Next steps:', 'cyan');
    console.log(`
  cd ${projectName}
  npm install
  
  # Setup environment
  cp .env.example .env
  
  # Run database migrations
  npm run prisma:migrate:dev
  
  # Start development server
  npm run start:dev
    `);

  } catch (error) {
    log(`\nError: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();