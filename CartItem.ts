import * as readline from "readline/promises";

class CartItem {
	itemcode: string;
	description: string;
	quantity: number;
	price: number;
	totalprice : number;

    constructor(itemcode: string, description: string, quantity: number, price: number) {
	this.itemcode = itemcode;
	this.description = description;
	this. quantity = quantity;
	this.price = price;
	this.totalprice = quantity*price;
    }
}

const cart: CartItem[] = [];
//write the main function to get the input
async function main() {

    const r1 = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let moreitem: boolean = true;
    while(moreitem) {
        const itemcode : string = await r1.question("Enter item code:");
        const description: string = await r1.question("Enter item_name:");
        const quantity: number = Number(await r1.question("Enter the quantity:"));
        const price: number = Number(await r1.question("Enter the price:"));

        const item = new CartItem(itemcode, description, quantity, price);
        cart.push(item);
        //now ask the question whether to repeat the item's bill
        const repeat: string = await(r1.question("Do you want to add more item(s) to the cart?"));
        if(repeat.trim().toLowerCase() =="no") { 
            moreitem = false;
        }
    }
    let grandTotal = 0;
    for(const item of cart) {
        grandTotal += item.totalprice;
    }
    console.log("\n Cart contents:");
    console.log(cart);
    console.log("Grand Total:" + grandTotal);
    r1.close();
    }

main();


