import axios, { AxiosInstance } from 'axios';
import { z } from 'zod';

// Define the schema for the BlockList response
const blockSchema = z.object({
    workchain: z.number(),
    shard: z.string(),
    seqno: z.number(),
    root_hash: z.string(),
    file_hash: z.string(),
    global_id: z.number(),
    version: z.number(),
    after_merge: z.boolean(),
    before_split: z.boolean(),
    after_split: z.boolean(),
    want_merge: z.boolean(),
    want_split: z.boolean(),
    key_block: z.boolean(),
    vert_seqno_incr: z.boolean(),
    flags: z.number(),
    gen_utime: z.string(),
    start_lt: z.string(),
    end_lt: z.string(),
    validator_list_hash_short: z.number(),
    gen_catchain_seqno: z.number(),
    min_ref_mc_seqno: z.number(),
    prev_key_block_seqno: z.number(),
    vert_seqno: z.number(),
    master_ref_seqno: z.union([z.number(), z.null()]),
    rand_seed: z.string(),
    created_by: z.string(),
    tx_count: z.union([z.number(), z.null()]),
    masterchain_block_ref: z.union([
        z.object({
            workchain: z.number(),
            shard: z.string(),
            seqno: z.number(),
        }),
        z.null(),
    ]),
    prev_blocks: z.array(
        z.object({
            workchain: z.number(),
            shard: z.string(),
            seqno: z.number(),
        })
    ),
});

const blockListSchema = z.object({
    blocks: z.array(blockSchema),
});

interface GetBlocksParams {
    workchain?: number | null;
    shard?: string | null;
    seqno?: number | null;
    start_utime?: number | null;
    end_utime?: number | null;
    start_lt?: number | null;
    end_lt?: number | null;
    limit?: number;
    offset?: number;
    sort?: 'asc' | 'desc';
}

// Define the class for interacting with the indexer API
class IndexerApiClient {
    private client: AxiosInstance;

    constructor(baseURL: string, apiKey?: string) {
        this.client = axios.create({
            baseURL,
            headers: {
                'Content-Type': 'application/json',
                ...(apiKey && { 'X-API-Key': apiKey }),
            },
        });
    }

    async getBlocks(params: GetBlocksParams) {
        try {
            const response = await this.client.get('/blocks', {
                params,
            });
            const parsedResponse = blockListSchema.safeParse(response.data);
            if (!parsedResponse.success) {
                throw new Error('Invalid response format');
            }
            return parsedResponse.data.blocks;
        } catch (error) {
            throw new Error(`Failed to fetch blocks: ${error}`);
        }
    }
}

async function main() {
    const client = new IndexerApiClient('https://toncenter.com/api/v3');

    const res = await client.getBlocks({ limit: 10, sort: 'asc' });
    console.log(res[0].prev_blocks);

}
main();
