import Dashboard from "@/pages/Dashboard"
/* Inventory */
import Product from "@/pages/inventory/Product"
import Unit from "@/pages/inventory/Unit"
import Tax from "@/pages/inventory/Tax"
/* Sales */
import Invoice from "@/pages/sales/Invoice"
import Revenue from "@/pages/sales/Revenue"
import Customer from "@/pages/sales/Customer"
/* Purchases */
import Bill from "@/pages/purchases/Bill"
import Payment from "@/pages/purchases/Payment"
import Vendor from "@/pages/purchases/Vendor"
/* Banking */
import Account from "@/pages/banking/Account"
import Transaction from "@/pages/banking/Transaction"
import Transfer from "@/pages/banking/Transfer"
/* Reports */
import Income_Expense from "@/pages/reports/Income_Expense";
import Vendor_Ledger_Report from "@/pages/reports/Vendor_Ledger_Report";
import Customer_Ledger_Report from "@/pages/reports/Customer_Ledger_Report";
/* Settings */
import Company from "@/pages/settings/Company"
import Category from "@/pages/settings/Category"

export const routes = [{
        path: "/products",
        component: Product,
        name: "Products"
    },
    /* Inventory */
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
    /* Sales */
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
    /* Purchases */
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
    /* Banking */
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
    /* Reports */
    {
        path: "/income&expense",
        component: Income_Expense,
        name: "Income & Expense"
    },
    {
        path: "/vendorLedgerReport",
        component: Vendor_Ledger_Report,
        name: "Vendor Ledger Report"
    },
    {
        path: "/customerLedgerReport",
        component: Customer_Ledger_Report,
        name: "Customer Ledger Report"
    },
    /* Settings */
    {
        path: "/company",
        component: Company,
        name: "Company"
    },
    {
        path: "/categories",
        component: Category,
        name: "Categories"
    },
    /* Dashboard */
    {
        path: "/",
        component: Dashboard,
        name: "Dashboard"
    }
]