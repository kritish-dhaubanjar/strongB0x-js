import Product from "@/pages/Product"
import Unit from "@/pages/Unit"
import Tax from "@/pages/Tax"
import Invoice from "@/pages/Invoice"
import Revenue from "@/pages/Revenue"
import Customer from "@/pages/Customer"
import Bill from "@/pages/Bill"
import Payment from "@/pages/Payment"
import Vendor from "@/pages/Vendor"
import Account from "@/pages/Account"
import Transaction from "@/pages/Transaction"
import Transfer from "@/pages/Transfer"
import Category from "@/pages/Category"

export const routes = [{
        path: "/products",
        component: Product,
        name: "Products"
    },
    {
        path: "/units",
        component: Unit,
        name: "Units"
    },
    {
        path: "/taxes",
        component: Tax,
        name: "Taxes"
    },
    {
        path: "/invoices",
        component: Invoice,
        name: "Invoices"
    },
    {
        path: "/revenues",
        component: Revenue,
        name: "Revenues"
    },
    {
        path: "/customers",
        component: Customer,
        name: "Customers"
    },
    {
        path: "/bills",
        component: Bill,
        name: "Bills"
    },
    {
        path: "/payments",
        component: Payment,
        name: "Payments"
    },
    {
        path: "/vendors",
        component: Vendor,
        name: "Vendors"
    },
    {
        path: "/accounts",
        component: Account,
        name: "Accounts"
    },

    {
        path: "/transactions",
        component: Transaction,
        name: "Transactions"
    },
    {
        path: "/transfers",
        component: Transfer,
        name: "Transfers"
    },
    {
        path: "/categories",
        component: Category,
        name: "Categories"
    },
    {
        path: "/",
        component: Product,
        name: "Dashboard"
    }
]