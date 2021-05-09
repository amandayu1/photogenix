var config = {
    stripeKey:'pk_test_51HWMAhGk1y0XgtXvyd1GDFxw67ZeNDmCBKKVENdV0FhUcWvVuqYjTaUh9oMCHT8pW6kSCXVqfgjPv6PflXXYA7by00tm4uRbs1',
};

if(window.location.hostname === 'wellifyapp.web.app' || window.location.hostname ==='wellify.vercel.app' || window.location.hostname ==='app.wellify.studio') {
    config={
        stripeKey: 'pk_live_51HWMAhGk1y0XgtXvykTbAXvxTr4ElUv7YOcXyg8JMa6L4n5mCFi7kGeWAGDTAdoLjDoi3YEVWqBtSNnL3AzUAQ5n00rJSsrAm4'
    }
}

export default config;