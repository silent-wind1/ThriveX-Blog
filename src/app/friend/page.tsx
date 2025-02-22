import Link from "next/link";
import { Metadata } from "next";

import { getWebDataAPI } from "@/api/project";
import { getWebListAPI, getWebTypeListAPI } from '@/api/web'
import { Web } from "@/types/app/web";

import Swiper from "@/components/Swiper";
import Starry from "@/components/Starry";
import ApplyForAdd from "./components/ApplyForAdd";

import { ToastContainer } from "react-toastify";
import { getUserDataAPI } from "@/api/user";

export const metadata: Metadata = {
    title: "朋友圈"
};

export default async () => {
    const { data: user } = await getUserDataAPI()
    const { data: web } = await getWebDataAPI();
    const { data: linkList } = await getWebListAPI()
    const { data: typeList } = await getWebTypeListAPI()

    let data: { [string: string]: { order: number, list: Web[] } } = {}

    // 给每个数据进行分组处理
    linkList?.forEach(item => {
        if (data[item.type.name]) {
            data[item.type.name].list.push(item)
        } else {
            // 查询出当前类型的排序
            const order = typeList.find(({ name }) => name === item.type.name)?.order!
            data[item.type.name] = { order, list: [] }
            data[item.type.name].list = [item]
        }
    })

    // 根据order进行从小到大排序
    const dataTemp = Object.entries(data);
    dataTemp.sort((a, b) => a[1].order - b[1].order);
    data = Object.fromEntries(dataTemp);

    return (
        <>
            <Swiper isRipple={false}>
                {/* 星空背景组件 */}
                <Starry />

                <div className="absolute top-[30%] left-[50%] transform -translate-x-1/2 flex flex-col items-center">
                    <div className="text-white text-[20px] xs:text-[25px] sm:text-[30px] whitespace-nowrap custom_text_shadow">一个人的寂寞，一群人的狂欢！</div>
                    <div className="mt-4 sm:mt-8">
                        <ApplyForAdd />
                    </div>
                </div>
            </Swiper>

            <div className="relative -top-20 xs:-top-20 sm:-top-32 md:-top-36 w-[90%] xl:w-[1200px] p-10 pt-2 mx-auto bg-white dark:bg-black-b border dark:border-black-b rounded-2xl space-y-8 transition-colors">
                <div>
                    <h3 className="w-full text-center text-xl p-4 dark:text-white transition-colors">本站信息</h3>

                    <div className="mx-auto p-3 space-y-2 border-l-[3px] border-primary bg-[#ecf7fe] rounded-md text-sm text-black-b">
                        <p>站点名称：{web.title}</p>
                        <p>站点介绍：{web.description}</p>
                        <p>站点图标：{user.avatar}</p>
                        <p>站点地址：{web.url}</p>
                    </div>
                </div>

                {
                    Object.keys(data)?.map((type, index) => (
                        <div key={index}>
                            <h3 className="w-full text-center text-xl p-4 dark:text-white transition-colors">{type}</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                {
                                    data[type].list?.map((item: Web) => (
                                        <Link key={item.id} href={item.url} target="_blank" className="group">
                                            <div key={item.id} className="flex items-center p-3 border group-hover:border-2 dark:border-[#3d4653] group-hover:!border-primary group-hover:shadow-[0_10px_20px_1px_rgb(83,157,253,.1)] rounded-md transition-colors">
                                                <img src={item.image} alt={item.title} className="w-14 h-14 mr-4 rounded-full" />

                                                <div className="flex flex-col space-y-2">
                                                    <h4 className="text-sm text-gray-700 dark:text-white group-hover:text-primary">{item.title}</h4>
                                                    <p className="text-xs text-[#8c9ab1] line-clamp-2">{item.description}</p>
                                                </div>
                                            </div>
                                        </Link>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>

            <ToastContainer />
        </>
    )
}