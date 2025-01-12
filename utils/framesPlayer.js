const sleep = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    framesPlayer: async function(response, frames, msBetweenFrame) {
        let cumulativeTimePassed = 0;
        let f = 0;
        while (true) {
            let t1 = performance.now();
            await response.edit(`\`${f}\n${frames[f]}\``)
            sleep(f * msBetweenFrame - cumulativeTimePassed);
            let t2 = performance.now();
            f = Math.floor(cumulativeTimePassed / msBetweenFrame);
            if (f > frames.length) return;
            let timePassed = t2 - t1;
            cumulativeTimePassed += timePassed;
        }
    }
}