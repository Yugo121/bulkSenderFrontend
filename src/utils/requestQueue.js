export class RequestQueue {
    constructor(rateLimitPerMinute = 40, onProgress = null) {
        this.queue = [];
        this.processing = false;
        this.paused = false;
        this.delay = Math.floor(60000 / rateLimitPerMinute);
        this.onProgress = onProgress;
        this.totalRequests = 0;
        this.completed = 0;
    }

    enqueue(request) {
        this.queue.push(request);
        this.totalRequests++;
        if (!this.processing && !this.paused) {
            this.processing = true;
            this.processNext();
        }
    }

    pause() {
        this.paused = true;
    }

    resume() {
        if(!this.paused) return;
        this.paused = false;
        if(!this.processing && this.queue.length > 0) {
            this.processing = true;
            this.processNext();
        }
    }

    cancel() {
        this.queue = [];
        this.processing = false;
        this.paused = false;
        this.totalRequests = 0;
        this.completed = 0;
        if (this.onProgress) {
            this.onProgress(this.completed, this.totalRequests);
        }
    }

    async processNext() {
        this.processing = true;

        while(this.queue.length > 0) {

            if(this.paused) {
                this.processing = false;
                return;
            }

            const task = this.queue.shift();
            try {
                await task();
                this.completed++;
                if (this.onProgress) {
                    this.onProgress(this.completed, this.totalRequests);
                }
            } catch (error) {
                console.error("Error processing request:", error);
            }
            await new Promise(resolve => setTimeout(resolve, this.delay));
        }

        this.processing = false;
    }
}