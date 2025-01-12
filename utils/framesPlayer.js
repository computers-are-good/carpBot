const sleep = ms => new Promise(res => setTimeout(res, ms));

module.exports = {
    framesPlayer: async function(response, frames, msBetweenFrame, captions) {
        let cumulativeTimePassed = 0;
        let f = 0;
        const captionsKeys = Object.keys(captions);
        while (true) {
            let line;
			for (let i = 0; i < captionsKeys.length; i++) {
				if (f < captions[1]) {
					line = captions[captionsKeys[0]]
				} else if (f > captionsKeys[captionsKeys.length - 1]) {
					line = captions[captionsKeys[captionsKeys.length - 1]]
				} else if (f > captionsKeys[i] && f < captionsKeys[i + 1]) {
					line = captions[captionsKeys[i]];
				} else if (captionsKeys.includes(f)) {
                    line = captions[f];
                }
			}
            let t1 = performance.now();
            await response.edit(`\`${line}\n${frames[f]}\``)
            sleep(f * msBetweenFrame - cumulativeTimePassed);
            let t2 = performance.now();
            f = Math.floor(cumulativeTimePassed / msBetweenFrame);
            if (f > frames.length) return;
            let timePassed = t2 - t1;
            cumulativeTimePassed += timePassed;
        }
    }
}