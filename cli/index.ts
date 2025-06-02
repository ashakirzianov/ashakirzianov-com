import { handleSaveCommand } from './save';

// Parse command-line arguments
export type CommandLineArgs = {
  commands: string[],
  switches: Record<string, string>,
}
function parseArgv(argv: string[]) {
  const [_, __, ...args] = argv
  const commands: string[] = []
  const switches: Record<string, string> = {}
  let currentSwitch: string | undefined = undefined
  for (const arg of args) {
    if (arg.startsWith('--')) {
      if (currentSwitch) {
        switches[currentSwitch] = 'true' // Default value for switch
      }
      currentSwitch = arg.substring('--'.length)
    } else {
      if (currentSwitch) {
        switches[currentSwitch] = arg
        currentSwitch = undefined
      } else {
        commands.push(arg); // Regular command or option
      }
    }
  }
  if (currentSwitch) {
    switches[currentSwitch] = 'true' // Default value for switch
  }

  return {
    commands, switches,
  }
}

// Main function
async function main() {
  const { commands, switches } = parseArgv(process.argv)
  const [command, ...rest] = commands
  switch (command) {
    case 'save':
      return await handleSaveCommand({ switches, commands: rest })
    default:
      console.error(`Unknown command: ${command}`)
      console.error('Available commands: save')
      process.exit(1)
  }
}

// Run the main function
main().catch(error => {
  console.error('Unhandled error:', error)
  process.exit(1)
})