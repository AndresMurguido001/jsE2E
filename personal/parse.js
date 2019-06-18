
const data = process.argv[2];
const product = process.argv[3];
const shippingService = process.argv[4];


function parseData(){
    const response = JSON.parse(data)
    const products = response.data
    const selectedSlug = `${shippingService}_service`
    return products.find(service => {
        if (service.subtype === product) {
            service.options.find(option => {
               if (option.slug === selectedSlug) {
                   console.log(option.uuid)
               }
           })
        }
    })


}
parseData();