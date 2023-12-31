const inquirer = require('inquirer');
const consola = require('consola');

enum Action {
  List = "list",
  Add = "add",
  Remove = "remove",
  Quit = "quit"
}

type InquirerAnswers = {
  action: Action
}

enum MessageVariant {
  Success = "success",
  Error = "error",
  Info = "info"
}

interface User {
  name: string,
  age: number
}

class Message {
  private content: string;

  constructor(content: string) {
    this.content = content;
  }

  static showColorized(variant: MessageVariant, text: string) {
    if(variant === MessageVariant.Success) return consola.success(text)
    else if(variant === MessageVariant.Error) return consola.error(text)
    else return consola.info(text)
  }

  show(): void {
    inquirer.prompt([{
      name: 'show',
      message: this.content
    }])
  }

  capitalize(): void {
    inquirer.prompt([{
      name: 'capitalize',
      message: this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase()
    }])
  }

  toUpperCase(): void {
    inquirer.prompt([{
      name: 'upper case',
      message: this.content.toUpperCase()
    }])
  }

  toLowerCase(): void {
    inquirer.prompt([{
      name: 'lower case',
      message: this.content.toLowerCase()
    }])
  }
}

class UsersData {
  data: User[] = [];

  showAll(): void {
    Message.showColorized(MessageVariant.Info, "Users data");
    if(this.data.length === 0) return Message.showColorized(MessageVariant.Error, "No data...")
    else return console.table(this.data)
  }

  add(user: User): void {
    if(user.age > 0 && user.name.length > 0) {
      this.data.push(user);
      Message.showColorized(MessageVariant.Success, "User has been successfully added!");
    } else return Message.showColorized(MessageVariant.Error, "Wrong data!");
  }

  remove(userName: string): void {
    const removeUser = this.data.find(user => user.name === userName);
    if(removeUser) {
      this.data = this.data.filter(user => user.name != userName);
      Message.showColorized(MessageVariant.Success, "User deleted");
    } else {
      Message.showColorized(MessageVariant.Error, "User not found...");
    }
  }
}


const users = new UsersData();

console.log("\n");
console.info("Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

const startApp = () => {
  inquirer.prompt([{
    name: 'action',
    type: 'input',
    message: 'How can I help you?',
  }]).then(async (answers: InquirerAnswers) => {
    switch (answers.action) {
      case Action.List:
        users.showAll();
        break;
      case Action.Add:
        const user = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }, {
          name: 'age',
          type: 'number',
          message: 'Enter age',
        }]);
        users.add(user);
        break;
      case Action.Remove:
        const name = await inquirer.prompt([{
          name: 'name',
          type: 'input',
          message: 'Enter name',
        }]);
        users.remove(name.name);
        break;
      case Action.Quit:
        Message.showColorized(MessageVariant.Info, "Bye bye!");
        return;
      default:
        Message.showColorized(MessageVariant.Info, "Command not found")
    }

    startApp();
  });
}


startApp();