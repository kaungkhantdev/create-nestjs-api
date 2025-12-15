#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
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
  dim: '\x1b[2m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// Spinner
function createSpinner(text) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  let interval;

  return {
    start() {
      process.stdout.write('\x1B[?25l'); // Hide cursor
      interval = setInterval(() => {
        process.stdout.write(`\r${colors.cyan}${frames[i]} ${text}${colors.reset}`);
        i = (i + 1) % frames.length;
      }, 80);
    },
    stop(success = true, finalText) {
      clearInterval(interval);
      process.stdout.write('\x1B[?25h'); // Show cursor
      const icon = success ? `${colors.green}✔` : `${colors.red}✖`;
      console.log(`\r${icon} ${finalText || text}${colors.reset}`);
    },
  };
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

async function runCommand(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { 
      stdio: 'pipe',
      shell: true 
    });
    
    let output = '';
    child.stdout.on('data', (data) => output += data);
    child.stderr.on('data', (data) => output += data);
    
    child.on('close', (code) => {
      if (code === 0) resolve(output);
      else reject(new Error(output));
    });
  });
}

async function main() {
  try {
    console.log();
    log(`🚀 Creating NestJS API project: ${projectName}\n`, 'cyan');

    // Download template with spinner
    const downloadSpinner = createSpinner('Downloading template...');
    downloadSpinner.start();
    
    await runCommand('npx', ['degit', 'kaungkhantdev/nestjs-api-starter', projectName]);
    
    downloadSpinner.stop(true, `Template downloaded successfully`);

    // Update package.json with spinner
    const configSpinner = createSpinner('Configuring project...');
    configSpinner.start();

    const pkgPath = path.join(targetPath, 'package.json');
    if (fs.existsSync(pkgPath)) {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      pkg.name = projectName;
      pkg.version = '0.0.1';
      pkg.description = '';
      pkg.author = '';
      delete pkg.repository;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));
    }

    configSpinner.stop(true, 'Project configured');

    // Success message
    console.log();
    log('✅ Project created successfully!\n', 'green');
    log('Next steps:', 'cyan');
    console.log(`
  ${colors.dim}$${colors.reset} cd ${projectName}
  ${colors.dim}$${colors.reset} npm install
  
  ${colors.dim}# Setup environment${colors.reset}
  ${colors.dim}$${colors.reset} cp .env.example .env
  
  ${colors.dim}# Run database migrations${colors.reset}
  ${colors.dim}$${colors.reset} npm run prisma:migrate:dev
  
  ${colors.dim}# Start development server${colors.reset}
  ${colors.dim}$${colors.reset} npm run start:dev
`);

  } catch (error) {
    log(`\nError: ${error.message}`, 'red');
    process.exit(1);
  }
}

main();
