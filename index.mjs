#!/usr/bin/env node
import fetch from 'node-fetch';
import { program } from 'commander';

program
  .version('0.1.0')
  .option('-u, --username <username>', 'GitHub username')
  .parse(process.argv);

const options = program.opts();

if (!options.username) {
  console.error('Error: Please provide a GitHub username using the -u or --username option.');
  process.exit(1);
}

const url = `https://api.github.com/users/${options.username}/events`;

fetch(url)
  .then(res => {
    if (!res.ok) {
      throw new Error(`Failed to fetch data: ${res.status} ${res.statusText}`);
    }
    return res.json();
  })
  .then(data => {
    console.log(data);
    if (data.length === 0) {
      console.log(`No events found for user ${options.username}.`);
    } else {
      console.log(`Recent events for ${options.username}:`);
      data.forEach((event, index) => {
        console.log(`Repo: ${event.repo.name}, Time: ${new Date(event.created_at).toLocaleString()}`);
      });
    }
  })
  .catch(err => console.error(`Error: ${err.message}`));
