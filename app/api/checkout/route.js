import { NextResponse } from 'next/server'

const PRODUCTS={
 'MULTI-CLOUD':{name:'Cloudbound Multi-Cloud Certification Bundle',amount:5900},
 'SAA-C03':{name:'AWS Solutions Architect — SAA-C03 Study Guide',amount:2900},
 'AZ-104':{name:'Azure Administrator — AZ-104 Study Guide',amount:2700},
 'PCA':{name:'Google Professional Cloud Architect Study Guide',amount:3200},
 'SCS-C02':{name:'AWS Security Specialty — SCS-C02 Study Guide',amount:3100},
 'AZ-900':{name:'Azure Fundamentals — AZ-900 Study Guide',amount:1900},
 'ACE':{name:'Google Associate Cloud Engineer Study Guide',amount:2500}
}

export async function POST(request){
 try{
  if(!process.env.STRIPE_SECRET_KEY)return NextResponse.json({error:'Stripe is not configured yet.'},{status:503})
  const {items}=await request.json()
  if(!Array.isArray(items)||items.length<1||items.length>20)return NextResponse.json({error:'Choose between 1 and 20 guides.'},{status:400})
  const counts=new Map()
  for(const code of items){if(typeof code!=='string'||!PRODUCTS[code])return NextResponse.json({error:'The cart contains an unknown guide.'},{status:400});counts.set(code,(counts.get(code)||0)+1)}
  const origin=new URL(request.url).origin
  const params=new URLSearchParams({mode:'payment',success_url:`${origin}/success?session_id={CHECKOUT_SESSION_ID}`,cancel_url:`${origin}/#guides`,allow_promotion_codes:'true','metadata[store]':'cloudbound','metadata[format]':'pdf-epub'})
  ;[...counts].forEach(([code,quantity],index)=>{const product=PRODUCTS[code];params.set(`line_items[${index}][price_data][currency]`,'usd');params.set(`line_items[${index}][price_data][unit_amount]`,String(product.amount));params.set(`line_items[${index}][price_data][product_data][name]`,product.name);params.set(`line_items[${index}][price_data][product_data][description]`,'Cloudbound digital ebook · PDF + EPUB');params.set(`line_items[${index}][quantity]`,String(quantity))})
  const stripeResponse=await fetch('https://api.stripe.com/v1/checkout/sessions',{method:'POST',headers:{Authorization:`Bearer ${process.env.STRIPE_SECRET_KEY}`,'Content-Type':'application/x-www-form-urlencoded'},body:params.toString(),cache:'no-store'})
  const session=await stripeResponse.json()
  if(!stripeResponse.ok||!session.url){console.error('Stripe Checkout error',session.error?.type,session.error?.code);return NextResponse.json({error:'Stripe could not create a checkout session.'},{status:502})}
  return NextResponse.json({url:session.url})
 }catch(error){console.error('Checkout route error',error);return NextResponse.json({error:'Checkout could not be started.'},{status:500})}
}
