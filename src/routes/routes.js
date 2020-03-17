import Product from "@/pages/Product"
import Unit from "@/pages/Unit"
import Tax from "@/pages/Tax"
import Customer from "@/pages/Customer"
import Vendor from "@/pages/Vendor"
import Account from "@/pages/Account"
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
        path: "/customers",
        component: Customer,
        name: "Customers"
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