#!/usr/bin/env node

import { Command } from "commander";

const program = new Command();

// Metadata
program
  .name("Wallet Tracker CLI")
  .description("A CLI tool for tracking your wallet")
  .version("1.0.0");

program.parse(process.argv);
