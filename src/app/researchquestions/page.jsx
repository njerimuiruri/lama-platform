import React from 'react';
import { HelpCircle, Users, TrendingUp, Target, ArrowUpRight } from 'lucide-react';

const ResearchQuestionsSection = () => {
    const questions = [
        {
            icon: Users,
            question: "What are the priority adaptation needs and aspirations of SSFs and their vulnerable groups at the local level?",
            color: "bg-blue-50 text-blue-600",
            accentColor: "border-blue-200"
        },
        {
            icon: TrendingUp,
            question: "What progress has been made in capturing the needs of SSFs in adaptation assessment and what approaches can be used to capture these needs?",
            color: "bg-green-50 text-green-600",
            accentColor: "border-green-200"
        },
        {
            icon: Target,
            question: "What metrics capture the aspirations of SSFs including various gender groups and how can these aspirations be enabled in adaptation interventions?",
            color: "bg-purple-50 text-purple-600",
            accentColor: "border-purple-200"
        },
        {
            icon: ArrowUpRight,
            question: "How can LLA metrics be aligned to national processes and gain traction in national adaptation planning and global adaptation assessment without just remaining project level numbers?",
            color: "bg-orange-50 text-orange-600",
            accentColor: "border-orange-200"
        }
    ];

    return (
        <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-green-100/30 to-emerald-100/30 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-blue-100/20 to-sky-100/20 rounded-full blur-3xl"></div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10 sm:mb-12 md:mb-16">
                        <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-2 mb-6">
                            <HelpCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-700 text-sm font-medium">Guiding Our Research</span>
                        </div>

                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 px-4">
                            Key <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Research Questions</span>
                        </h2>

                        <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
                            Our research is driven by critical questions that help us understand and improve locally led adaptation metrics for small-scale fisheries and vulnerable communities
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                        {questions.map((item, index) => {
                            const Icon = item.icon;
                            return (
                                <div
                                    key={index}
                                    className="group bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-lg border-2 border-transparent hover:border-green-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
                                >
                                    <div className="flex items-start gap-4 sm:gap-5">
                                        {/* Icon */}
                                        <div className={`flex-shrink-0 p-3 sm:p-4 rounded-xl ${item.color} group-hover:scale-110 transition-transform duration-300`}>
                                            <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2 mb-3">
                                                <span className="flex-shrink-0 inline-flex items-center justify-center w-7 h-7 bg-gradient-to-br from-green-500 to-emerald-600 text-white text-sm font-bold rounded-full">
                                                    {index + 1}
                                                </span>
                                            </div>
                                            <p className="text-base sm:text-lg text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors duration-300">
                                                {item.question}
                                            </p>
                                        </div>
                                    </div>

                                    <div className={`mt-6 h-1 w-0 group-hover:w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full transition-all duration-500`}></div>
                                </div>
                            );
                        })}
                    </div>


                </div>
            </div>
        </section>
    );
};

export default ResearchQuestionsSection;