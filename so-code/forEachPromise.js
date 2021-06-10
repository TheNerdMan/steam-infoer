
module.exports = {
    forEachPromise
}  

/**
 * https://stackoverflow.com/a/41791149/13242683
 * @param items An array of items.
 * @param fn A function that accepts an item from the array and returns a promise.
 * @param context A object that can be interacted with if the function needs to.
 * @returns {Promise}
 * @author Steven Spungin
 * 
 * @usage 
 * Used like so:
 *  
        const items = ['a', 'b', 'c'];   
        const context = {};
        context.itemCount = 0;        

        function logItem(item, context) {
            return new Promise((resolve, reject) => {
                process.nextTick(() => {
                    console.log(item);
                    context.itemCount++;
                    resolve();
                })
            });
        }

        forEachPromise(items, logItem, context).then(() => {
            console.log(`done: ${context.itemCount} items`);
        });
 */
function forEachPromise(items, fn, context) {
    return items.reduce((promise, item) => {
        return promise.then(() => {
            return fn(item, context);
        });
    }, Promise.resolve());
}
