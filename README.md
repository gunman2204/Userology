The Project contains two three pages, the homePage('/'), the dashboard page('/dashboard') and the City Page('/city'). 

The homePage contains three sections  Weather Information of three cities on Left side(however not working due to API string starting with HTTP & not with HTTPS) ,the Crpto Data displayed in the middle section, and the CrptoNews section on the right.

The Weather Page makes three API request to fetch Weather details of three predefined citites and renders them in a nice layout. I searched but couldn't find any free API showing weather details of numerous cities.

The Crypto Section fetched data through API from capcoin and showing details(Price, MarketCap, Volume, Change24Hr) of around 100 Cryptos. 
For this, I have used React useState to store the objects fetched throuh API calls.

The News Data is recieved and displayed using map function.

The city Page details the weather conditions of a city in an impressive Layout.

I know, there are still numerous scope of improvements in my code like
1) I shoudld have recalled for WebSocket connection immediately again if failed.
2) The weather API need to have https request
3) The city Page should have opened for a city which is clicked upon in the weather section
4) The beauty of the pages can be improved.

I was able to do this much given the time restrictions and many more institute work going along. Given freedom of time and extra obligations, I assure you I will make the best website with the best look and functioning.
Thanks.
   


`This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


