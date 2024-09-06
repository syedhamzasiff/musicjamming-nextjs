import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"
import { prismaClient } from "@/app/lib/db";
const YT_REGEX = new RegExp(/^https:\/\/www\.youtube\.com\/watch\?v=[\w-]{11}$/);



const CreateStreamSchema = z.object({
    createrId: z.string(),
    url: z.string() //youtube or spotify inside - zod docs
})

export async function POST(req: NextRequest) {
    try {
        const data = CreateStreamSchema.parse(await req.json());

        const isYt = YT_REGEX.test(data.url);

        if (!isYt) {
            return NextResponse.json({
                message: "Wrong URL format"
            }, {status: 401

            })
        }

        const extractId = data.url.split("?v=")[1];

        prismaClient.stream.create({
            data: {
                userId: data.createrId,
                url: data.url,
                extractId,
                type: "Youtube"
            }    
        })


    } catch (error) {
        return NextResponse.json({
            message: "Error while adding a stream"
        }, {status: 411

        })
    }


}