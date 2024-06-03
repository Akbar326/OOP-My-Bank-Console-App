import inquirer from "inquirer";
import chalk from "chalk";
// Bank Account Class
class BankAccount {
    accountNumber;
    balance;
    constructor(accountNumber, balance) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }
    // Debit Money
    withdraw(amount) {
        if (amount > 0) {
            if (this.balance >= amount) {
                this.balance -= amount;
                console.log(chalk.green(`\nWithdrawal of $${amount} successful. Your remaining balance is $${this.balance}.\n`));
            }
            else {
                console.log(chalk.red("\nInsufficient balance.\n"));
            }
        }
        else {
            console.log(chalk.red("\nAmount must be positive.\n"));
        }
    }
    // Credit Money
    deposit(amount) {
        if (amount > 0) {
            if (amount > 100) {
                amount -= 1; // Transaction fee
            }
            this.balance += amount;
            console.log(chalk.green(`\nDeposit of $${amount} successful. Your remaining balance is $${this.balance}.\n`));
        }
        else {
            console.log(chalk.red("\nAmount must be positive.\n"));
        }
    }
    // Balance Inquiry
    balanceInquiry() {
        console.log(chalk.blue(`\nYour balance is $${this.balance}.\n`));
    }
}
// Customer Class
class Customer {
    firstName;
    lastName;
    gender;
    age;
    mobileNumber;
    account;
    constructor(firstName, lastName, gender, age, mobileNumber, account) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}
// Create Bank Accounts
const accounts = [
    new BankAccount(1001, 1000),
    new BankAccount(1002, 2000),
    new BankAccount(1003, 3000),
];
// Create Customers
const customers = [
    new Customer("Akbar", "Ali", "Male", 30, 1234567890, accounts[0]),
    new Customer("Azlan", "Khan", "Male", 18, 2345678901, accounts[1]),
    new Customer("Rohan", "Khan", "Male", 20, 3456789012, accounts[2]),
];
// Function to interact with bank account
async function service() {
    console.log(chalk.yellow("\nWelcome to MyBank! Please follow the instructions to manage your account.\n"));
    while (true) {
        const { accountNumber } = await inquirer.prompt({
            name: "accountNumber",
            type: "number",
            message: "Enter your account number:",
        });
        const customer = customers.find(customer => customer.account.accountNumber === accountNumber);
        if (customer) {
            console.log(chalk.yellow(`\nWelcome ${customer.firstName} ${customer.lastName}!\n`));
            while (true) {
                const { select } = await inquirer.prompt([{
                        name: "select",
                        type: "list",
                        message: "Select a service:",
                        choices: ["Deposit", "Withdraw", "Balance Inquiry", "Exit"],
                    }]);
                if (select === "Exit") {
                    console.log(chalk.magenta("\nThank you for using our bank service! Goodbye!\n"));
                    return;
                }
                switch (select) {
                    case "Deposit":
                        const { amount: depositAmount } = await inquirer.prompt({
                            name: "amount",
                            type: "number",
                            message: "Enter the amount to deposit:"
                        });
                        customer.account.deposit(depositAmount);
                        break;
                    case "Withdraw":
                        const { amount: withdrawAmount } = await inquirer.prompt({
                            name: "amount",
                            type: "number",
                            message: "Enter the amount to withdraw:",
                        });
                        customer.account.withdraw(withdrawAmount);
                        break;
                    case "Balance Inquiry":
                        customer.account.balanceInquiry();
                        break;
                }
                const { continueChoice } = await inquirer.prompt({
                    name: "continueChoice",
                    type: "list",
                    message: "Would you like to perform another operation?",
                    choices: ["Yes", "No, Exit"],
                });
                if (continueChoice === "No, Exit") {
                    console.log(chalk.magenta("\nThank you for using our bank service! Goodbye!\n"));
                    return;
                }
            }
        }
        else {
            console.log(chalk.red("\nInvalid account number. Please try again.\n"));
        }
    }
}
service();
