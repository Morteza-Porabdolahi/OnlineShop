import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        accountPage: resolve(__dirname, 'pages/accountPage.html'),
        blogPage: resolve(__dirname, 'pages/blogPage.html'),
        cartPage: resolve(__dirname, 'pages/cartPage.html'),
        checkOutPage: resolve(__dirname, 'pages/checkOutPage.html'),
        shopPage: resolve(__dirname, 'pages/shopPage.html'),
        singleBlogPage: resolve(__dirname, 'pages/singleBlogPage.html'),
        singleProductPage: resolve(__dirname, 'pages/singleProductPage.html'),
        wishlistPage: resolve(__dirname, 'pages/wishlistPage.html'),
      },
    },
  },
})
