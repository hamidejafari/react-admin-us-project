const permissions = [
  {
    label: "Setting",
    value: "/setting",
    back: [
      { url: "/admin/setting", method: "GET" },
      { url: "/admin/setting", method: "PUT" },
    ],
  },
  {
    label: "Vs",
    value: "/vs",
    back: [
      { url: "/admin/comparisons", method: "GET" },
      { url: "/admin/comparisons-grouped", method: "GET" },
      { url: "/admin/comparisons/brand/grouped", method: "GET" },
      { url: "/admin/comparisons", method: "POST" },
      { url: "/admin/comparisons/:_id", method: "GET" },
      { url: "/admin/comparisons", method: "PUT" },
    ],
  },
  {
    label: "Redirect List",
    value: "/redirects",
    back: [{ url: "/admin/redirects", method: "GET" }],
  },
  {
    label: "Brand Control List",
    value: "/control-brands",
    back: [{ url: "/admin/control-brands", method: "GET" }],
  },
  {
    label: "Product Control List",
    value: "/control-products",
    back: [{ url: "/admin/control-products", method: "GET" }],
  },
  {
    label: "Category Control List",
    value: "/control-categories",
    back: [{ url: "/admin/control-categories", method: "GET" }],
  },
  {
    label: "Review List",
    value: "/reviews",
    back: [{ url: "/admin/reviews", method: "GET" }],
  },
  {
    label: "Review Create",
    value: "/reviews/create",
    back: [{ url: "/admin/reviews", method: "POST" }],
  },
  {
    label: "Review Delete",
    value: "/reviews/delete",
    back: [{ url: "/admin/reviews", method: "DELETE" }],
  },

  {
    label: "Best Category List",
    value: "/best-categories",
    back: [{ url: "/admin/best-categories", method: "GET" }],
  },
  {
    label: "Review Change Status",
    value: "/reviews/",
    back: [
      { url: "/admin/reviews/:_id", method: "PUT" },
      { url: "/admin/reviews/:_id", method: "GET" },
    ],
  },
  {
    label: "Blog Category list",
    value: "/blog-categories",
    back: [{ url: "/admin/blog-categories", method: "GET" }],
  },
  {
    label: "Blog Category Create",
    value: "/blog-categories/create",
    back: [{ url: "/admin/blog-categories", method: "POST" }],
  },
  {
    label: "Blog Category edit",
    value: "/blog-categories/:_id",
    back: [
      { url: "/admin/blog-categories/:_id", method: "PUT" },
      { url: "/admin/blog-categories/:_id", method: "GET" },
    ],
  },
  {
    label: "Blog list",
    value: "/blogs",
    back: [{ url: "/admin/blogs", method: "GET" }],
  },
  {
    label: "Blog Create",
    value: "/blogs/create",
    back: [{ url: "/admin/blogs", method: "POST" }],
  },
  {
    label: "Blog edit",
    value: "/blogs/:_id",
    back: [
      { url: "/admin/blogs/:_id", method: "PUT" },
      { url: "/admin/blogs/:_id", method: "GET" },
    ],
  },
  {
    label: "Coupon list",
    value: "/coupons",
    back: [{ url: "/admin/coupons", method: "GET" }],
  },
  {
    label: "Coupon Create",
    value: "/coupons/create",
    back: [{ url: "/admin/coupons", method: "POST" }],
  },
  {
    label: "Banners",
    value: "/banners",
    back: [],
  },
  {
    label: "contact us",
    value: "/contact-us",
    back: [],
  },
  {
    label: "search history",
    value: "/search-history",
    back: [],
  },
  {
    label: "Coupon edit",
    value: "/coupons/:_id",
    back: [
      { url: "/admin/coupons/:_id", method: "PUT" },
      { url: "/admin/coupons/:_id", method: "GET" },
    ],
  },
  {
    label: "Category list",
    value: "/categories",
    back: [{ url: "/admin/categories", method: "GET" }],
  },
  {
    label: "Category create",
    value: "/categories/create",
    back: [{ url: "/admin/categories", method: "POST" }],
  },
  {
    label: "Category edit",
    value: "/categories/:_id",
    back: [
      { url: "/admin/categories/:_id", method: "PUT" },
      { url: "/admin/categories/:_id", method: "GET" },
    ],
  },

  {
    label: "Category slug edit",
    value: "/categories/slug-edit",
    back: [
      { url: "/admin/categories", method: "PUT" },
      { url: "/admin/categories/:_id", method: "GET" },
    ],
  },

  {
    label: "Category Edit Image",
    value: "/categories/image",
    back: [],
  },
  {
    label: "Category Edit Other Fields",
    value: "/categories/other",
    back: [],
  },
  {
    label: "Delete Category",
    value: "/categories/delete",
    back: [
      { url: "/admin/categories/:_id", method: "DELETE" },
      { url: "/admin/categories", method: "GET" },
    ],
  },
  {
    label: "Product List",
    value: "/products",
    back: [{ url: "/admin/products", method: "GET" }],
  },
  {
    label: "Product create",
    value: "/products/create",
    back: [{ url: "/admin/products", method: "POST" }],
  },
  {
    label: "Product edit",
    value: "/products/:_id",
    back: [
      { url: "/admin/products", method: "PUT" },
      { url: "/admin/products/:_id", method: "GET" },
    ],
  },
  {
    label: "Product slug edit",
    value: "/products/slug-edit",
    back: [
      { url: "/admin/products", method: "PUT" },
      { url: "/admin/products/:_id", method: "GET" },
    ],
  },
  {
    label: "Product Edit Image",
    value: "/products/image",
    back: [],
  },
  {
    label: "Product Edit Other Fields",
    value: "/products/other",
    back: [],
  },
  {
    label: "Delete Product",
    value: "/products/delete",
    back: [
      { url: "/admin/products/:_id", method: "DELETE" },
      { url: "/admin/products", method: "GET" },
    ],
  },
  {
    label: "Brand List",
    value: "/brands",
    back: [{ url: "/admin/brands", method: "GET" }],
  },
  {
    label: "Brand Create",
    value: "/brands/create",
    back: [{ url: "/admin/brands", method: "POST" }],
  },

  {
    label: "Brand slug edit",
    value: "/brands/slug-edit",
    back: [
      { url: "/admin/brands", method: "PUT" },
      { url: "/admin/brands/:_id", method: "GET" },
    ],
  },

  {
    label: "Brand edit",
    value: "/brands/:_id",
    back: [
      { url: "/admin/brands", method: "PUT" },
      { url: "/admin/brands", method: "GET" },
    ],
  },

  {
    label: "Brand Edit Image",
    value: "/brands/image",
    back: [],
  },
  {
    label: "Brand Edit Other Fields",
    value: "/brands/other",
    back: [],
  },

  {
    label: "Delete Brand",
    value: "/brands/delete",
    back: [
      { url: "/admin/brands/:_id", method: "DELETE" },
      { url: "/admin/brands", method: "GET" },
    ],
  },
  {
    label: "Admin List",
    value: "/admins",
    back: [
      { url: "/admin/all-admins", method: "PUT" },
      { url: "/admin/brands", method: "GET" },
    ],
  },
  {
    label: "Delete User",
    value: "/admins",
    back: [{ url: "/admin/users/", method: "DELETE" }],
  },
  {
    label: "Admin Create",
    value: "/users/create-admin",
    back: [
      { url: "/admin/roles", method: "GET" },
      { url: "/admin/create-admin", method: "POST" },
    ],
  },
  {
    label: "Admin Edit",
    value: "/users/edit-admin/:_id",
    back: [
      { url: "/admin/roles", method: "GET" },
      { url: "/admin/users/:_id", method: "GET" },
      { url: "/admin/update-admin/:_id", method: "PUT" },
    ],
  },
  {
    label: "Role List",
    value: "/roles",
    back: [{ url: "/admin/roles", method: "GET" }],
  },
  {
    label: "Role Create",
    value: "/roles/create",
    back: [
      { url: "/admin/roles", method: "GET" },
      { url: "/admin/users/:_id", method: "GET" },
      { url: "/admin/update-admin/:_id", method: "PUT" },
    ],
  },
  {
    label: "Delete Role",
    value: "/roles",
    back: [
      { url: "/admin/roles/:_id", method: "DELETE" },
      { url: "/admin/roles", method: "GET" },
    ],
  },
  {
    label: "Role Edit",
    value: "/roles/:_id",
    back: [
      { url: "/admin/roles/:_id", method: "PUT" },
      { url: "/admin/category-level-one", method: "GET" },
    ],
  },
  {
    label: "Logs Get",
    value: "/logs",
    back: [{ url: "/admin/logs", method: "GET" }],
  },
  {
    label: "noIndex",
    value: "no-index",
    back: [
      { url: "/admin/roles/:_id", method: "PUT" },
      { url: "/admin/category-level-one", method: "GET" },
    ],
  },
  {
    label: "count published and noIndex",
    value: "count-published-noIndex",
  },
  {
    label: "business brands Get",
    value: "/business-brands",
  },
  {
    label: "business brands Edit",
    value: "/business-brands/:_id",
  },
];

export default permissions;
