#! /usr/bin/env node

import inquirer from "inquirer";
import chalk from "chalk";

interface BankAccount {
    accountNumber: number;
    balance: number;
    withdraw(amount: number): void;
    deposit(amount: number): void;
    balanceInquiry(): void;
}

class BankAccount implements BankAccount {
    accountNumber: number;
    balance: number;

    constructor(accountNumber: number, balance: number) {
        this.accountNumber = accountNumber;
        this.balance = balance;
    }
    
    withdraw(amount: number): void {
        if (amount > 0) {
            if (this.balance >= amount) {
                this.balance -= amount;
                console.log(chalk.green(`\nWithdrawal of $${amount} successful. Your remaining balance is $${this.balance}.\n`));
            } else {
                console.log(chalk.red("\nInsufficient balance.\n"));
            }
        } else {
            console.log(chalk.red("\nAmount must be positive.\n"));
        }
    }
    
    deposit(amount: number): void {
        if (amount > 0) {
            if (amount > 100) {
                amount -= 1;
            }
            this.balance += amount;
            console.log(chalk.green(`\nDeposit of $${amount} successful. Your remaining balance is $${this.balance}.\n`));
        } else {
            console.log(chalk.red("\nAmount must be positive.\n"));
        }
    }
    
    balanceInquiry(): void {
        console.log(chalk.blue(`\nYour balance is $${this.balance}.\n`));
    }
}

class Customer {
    firstName: string;
    lastName: string;
    gender: string;
    age: number;
    mobileNumber: number;
    account: BankAccount;

    constructor(firstName: string, lastName: string, gender: string, age: number, mobileNumber: number, account: BankAccount) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.gender = gender;
        this.age = age;
        this.mobileNumber = mobileNumber;
        this.account = account;
    }
}

const accounts: BankAccount[] = [
    new BankAccount(1001, 1000),
    new BankAccount(1002, 2000),
    new BankAccount(1003, 3000),
];

const customers: Customer[] = [
    new Customer("Akbar", "Ali", "Male", 30, 1234567890, accounts[0]),
    new Customer("Azlan", "Khan", "Male", 18, 2345678901, accounts[1]),
    new Customer("Rohan", "Khan", "Male", 20, 3456789012, accounts[2]),
];

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
        } else {
            console.log(chalk.red("\nInvalid account number. Please try again.\n"));
        }
    }
}

service();
