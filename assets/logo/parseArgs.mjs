import { parseArgs as nativeParseArgs } from 'node:util';

process.on('uncaughtException', error => {
  if (error.name === 'TypeError' && error.code === 'ERR_PARSE_ARGS_UNKNOWN_OPTION') {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
});

function helpOptions(options) {
  let help = 'Options:\n';
  for (const [name, param] of Object.entries(options)) {
    help += '  ';
    if (param.short) {
      help += `-${param.short}, `;
    }
    help += `--${name}`;
    if (param.description) {
      help += `\t\t${param.description}`;
    }
    help += '\n';
  }

  return help;
}

function showHelp(config) {
  if (config.usage) {
    process.stdout.write(config.usage);
  } else {
    process.stdout.write(`Usage:\n  <script> <args> [options]`);
  }

  process.stdout.write('\n\n');
  process.stdout.write(helpOptions(config.options));
}

function checkRequired(args, options) {
  for (const [name, config] of Object.entries(options)) {
    if (config.required && args[name] === undefined) {
      console.error(`Error:\n  Missing option --${name}\n`);
      return false;
    }
  }
  return true;
}

function cast(args, options) {
  for (const [name, value] of Object.entries(args)) {
    switch (options[name].cast) {
      case 'integer':
        args[name] = parseInt(value);
        break;
      case 'float':
        args[name] = parseFloat(value);
        break;
    }
  }
}

export function parseArgs(config) {
  if (config.options.help === undefined) {
    config.options.help = {
      type: 'boolean',
      description: 'show this help message',
    };
  }

  const { values, positionals } = nativeParseArgs(config);

  if (values.help === true || !checkRequired(values, config.options)) {
    showHelp(config);
    process.exit(0);
  }

  if (!checkRequired(values, config.options)) {
    showHelp(config);
    process.exit(1);
  }

  if (Array.isArray(config.demand) && config.demand.length === 2) {
    if (positionals.length < config.demand[0] || positionals.length > config.demand[1]) {
      console.error('Error:\n  Invalid or missing positional argument\n');
      showHelp(config);
      process.exit(1);
    }
  }

  cast(values, config.options);

  return {
    argv: values,
    positionals,
  };
}
