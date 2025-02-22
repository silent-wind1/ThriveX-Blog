import Link from 'next/link';
import Image from 'next/image';
import { getRecommendedArticleListAPI } from '@/api/article';
import { IoIosArrowForward } from "react-icons/io";
import fire from '@/assets/svg/other/fire.svg';
import "./index.scss";

const RandomArticle = async () => {
    // 获取热门文章
    const { data } = await getRecommendedArticleListAPI();

    return (
        <div className='hotArticleComponent'>
            <div className="flex flex-col tw_container bg-white dark:bg-black-b p-4 mb-5 tw_title">
                <div className="tw_title w-full dark:text-white">
                    <Image src={fire} alt='热门文章' width={30} height={20} />
                    <span> 热门文章</span>
                </div>

                {/* 文章列表 */}
                <div className='w-full'>
                    {data?.map((item) => (
                        <div key={item.id}>
                            <Link href={`/article/${item.id}`} className='w-full flex items-center py-2 text-gray-600 dark:text-[#8c9ab1] text-sm transition-all hover:!text-primary hover:pl-2'>
                                <IoIosArrowForward className="text-lg mr-1" />
                                <span className='w-full line-clamp-1'>{item.title}</span>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RandomArticle;