export function saveToLocal(id, key, value) {
    let seller = window.localStorage.__seller__;
    if (!seller) {
        seller = {};
        seller[id] = {};
        // seller[id][key] = value;
    } else {
        seller = JSON.parse(seller);
        if (!seller[id]) {
            seller[id] = {};
            // seller[id][key] = value;
        };
        seller[id][key] = value;
        
    }
    window.localStorage.__seller__ = JSON.stringify(seller);
}
export function loadFromLocal(id, key, def) {
         let seller=window.localStorage.__seller__;
         if(!seller){
             return def;
         }
         seller=JSON.parse(seller)[id];
         if(!seller){
             return def;
         }
         let ref=seller[key];
        //  console.log(ref)
         console.log(ref||def)
         return ref||def;
};