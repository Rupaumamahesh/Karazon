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
        const repeat: string = await(r1.question("Do you want to add more item(s) to the cart [yes/no]?"));
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
    const discountedAmount : number = await ApplyMembershipDiscount(r1, grandTotal);
    const Total : number = await ApplyGST(discountedAmount);
    const totalBeforeInvoice: number = await PaymentMode(r1, Total);
    r1.close();
    }

main();

//note we're not creating a new object, so hence we're not including CreateInterface
//reuse the same scanner object, so we're passing it into arguments
async function ApplyMembershipDiscount(r1: readline.Interface,grandTotal: number) {
    //ask for membershiptype
    const isMember: string = await r1.question("Do you have membership[yes/no]?");
    // const gold_discount: number = 0.05;
    // const silver_discount: number = 0.10;
    // const platinum_discount: number = 0.15;
    let discountAmount : number = 0;
    if(isMember.trim().toLowerCase() =="yes") {
        //ask for specfic membership status
        const membershipType : string = await r1.question("What is your membership type[gold/silver/platinum]?");
        if(membershipType.trim().toLowerCase() =="gold") {
            discountAmount = grandTotal*0.05;
        }
        else if(membershipType.trim().toLowerCase() =="silver") {
            discountAmount = grandTotal*0.10;
        }
        else if(membershipType.trim().toLowerCase() =="platinum"){
            discountAmount = grandTotal*0.15;
        }
        else {
            discountAmount = 0;
        }
    }
    else {
        discountAmount = 0;
    }
    const discountedAmount: number = grandTotal - discountAmount;
    console.log("Discount Amount:" + discountAmount);
    console.log("Discounted amount:" + discountedAmount);
    return discountedAmount;
}
async function ApplyGST(discountedAmount: number) {
    const gstRate: number = 0.18;
    const platformFeeRate : number = 0.002;
    const gstAmount : number = discountedAmount * gstRate;
    const platformFee: number = discountedAmount * platformFeeRate;
    const Total: number = discountedAmount + gstAmount + platformFee;
    console.log("GST rate :" + gstAmount + " Plaform fee: " + platformFee);
    console.log("Updated total with tax and fees:" + Total.toFixed(2));
    return Total;
}

async function PaymentMode(r1: readline.Interface, Total: number) {
    const paymentMode : string = await r1.question("What is your paymentmode[Card/UPI/Cash]?");
    const surcharge: number = 0.025;
    const convenienceFeeRate: number = 0.01;
    let totalBeforeInvoice : number = 0;
    if(paymentMode.trim().toLowerCase()=="card") {
        if(Total < 1000) {
            const surchargeFees: number = Total*0.025;
            console.log("Surcharge Fees (2.5%):" + surchargeFees);
            totalBeforeInvoice = Total + surcharge;
        }
        else {
            totalBeforeInvoice = Total;
        }
    }
    else {
        const convenienceFees : number = Total*convenienceFeeRate;
        console.log("Convinence Fees (1%): "+ convenienceFees);
        totalBeforeInvoice = Total + convenienceFees;
    }
    console.log("Final total Before Invoice: " + totalBeforeInvoice);
    return totalBeforeInvoice;
} 

