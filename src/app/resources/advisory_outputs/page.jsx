"use client"
import Image from "next/image"
import LamaNavbar from "@/components/Navbar/navbar"
import LamaFooter from "@/components/Footer/footer"

const AdvisoryPage = () => {
    const advisoryMembers = [
        {
            name: "Marie-Eve",
            role: "IDRC : Funder",
            image: "/images/marie-eve.jpeg",
            bio: "",
            expertise: [""],
        },
        {
            name: "Ms. Omari Kulthoum",
            role: "Coordinator for the African Group of Negotiations (AGN) on the Africa Adaptation Initiative",
            image: "/images/omar.png",
            bio: "Coordinator for the African Group of Negotiations (AGN) on the Africa Adaptation Initiative. She&apos;s also a PhD candidate at the University of Cape Town with the African Climate Development Initiative studying adaptation governance, with a particular focus on drought governance in Botswana. She has extensive experience in climate adaptation, and in 2018, she joined the Adaptation Committee (AC).",
            expertise: ["Climate Adaptation", "Drought Governance", "International Negotiations"],
        },
        {
            name: "Professor Anthony Nyong",
            role: "Director of Climate Change and Green Growth at the African Development Bank (AfDB)",
            image: "/images/antony.png",
            bio: "Director of Climate Change and Green Growth at the African Development Bank (AfDB). Mr. Nyong has about 30 years of experience in environmental and natural resources management, renewable energy and green growth. Positions he has held at the African Development Bank include Coordinator of the New Deal on Energy; Head of the Renewable Energy Flagship, Head of Gender, Climate Change and Sustainable Development Unit; and Head of the Compliance and Safeguards Division. Before joining the Bank, he was a Senior Climate Change Specialist at the International Development Research Centre of Canada and a Professor of Climate Change at the University of Jos, Nigeria. He was a Coordinating Lead Author for the IPCC Fourth Assessment Report and a member of the IPCC Task Group on Data and Scenario Support for Impact and Climate Analysis. Mr. Nyong has also served on several Global Advisory and Scientific Boards including the Sustainable Stock Exchange Green Finance Advisory Group. Mr. Nyong holds a Ph.D. in Geography from McMaster University, Canada. He is a Senior Executive Fellow of the Harvard Kennedy School of Government, a Chartered Geographer and a Fellow of the African Academy of Sciences. He is named among the top 20 of the 100 most Influential People in Climate Policy by 2019 by Apolitical",
            expertise: ["Climate Change", "Green Growth", "Renewable Energy"],
        },
        {
            name: "Charles Mwangi",
            role: "Head of Programs at the Pan African Climate Justice Alliance (PACJA)",
            image: "/images/charlesmwangi.png",
            bio: "Charles Mwangi is a seasoned Climate Change Specialist with over 17 years of experience working across local, national, and international levels. Currently, as the Head of Programs at the Pan African Climate Justice Alliance (PACJA), he plays a pivotal role in designing and executing climate change and community-based development initiatives across Africa. He oversees the implementation of 11 such initiatives across all 51 African countries. With a strong background in strategic management and operational skills, Charles excels in fundraising and executing climate change and conservation projects funded by diverse partners. Prior to his role at PACJA, he led PACJA&apos;s work on resilient people, society, and economies in all 51 African countries. He has also significantly contributed to the Sustainable Tropics Alliance (STA) in an advisory capacity and participated in Low Emission Rural Development discussions across several countries. In Kenya, Charles has been actively involved in policy development concerning climate change and REDD+ (Reducing Emissions from Deforestation and Forest Degradation). His past roles include serving as the Head of Programs at the East Africa Wildlife Society and leading the climate change department at the Green Belt Movement. Beyond climate change, Charles has a keen interest in natural resources conflict resolution and mediation. He is trained in reflexive mediation and has contributed to the development of conflict resolution courses for institutions. Charles holds a Bachelor&apos;s degree in Education Science and a Master&apos;s degree in Plant Ecology.",
            expertise: ["Climate Justice", "Community Development", "Policy Development"],
        },
        {
            name: "Victoria Rubadiri",
            role: "Media/Journalism : Royal Media",
            image: "/images/victoria.jpg",
            bio: "",
            expertise: ["Journalism", "Media"],
        },
        {
            name: "Prof Cromwel Lukorito",
            role: "IPCC Adaptation Lead",
            image: "/images/CromwelLukorito_PP.webp",
            bio: "a leading figure in advancing global climate adaptation efforts, particularly with a focus on Africa.His role involves guiding the assessment of climate change impacts, vulnerabilities, and adaptation measures, with a specific emphasis on socio- economic and natural systems",
            expertise: ["Journalism", "Media"],
        },
        {
            name: "Victor Nyagaya",
            role: "CEO Lake Region thegREB",
            image: "",
            bio: "Victor Nyagaya is the Chief Executive Officer of the Lake Region Economic Bloc (LREB), a regional body representing 14 counties in Kenya&apos;s Lake Basin region, which has a population of over 14 million people, constituting about 30% of Kenya&apos;s total population.In this role, he is responsible for driving the socioeconomic aspirations of the region.",
            expertise: [""],
        },
        {
            name: "Mr Malik Aman",
            role: "Rep of the World Bank/ FLOCA - Kenya Treasury",
            image: "",
            bio: "",
            expertise: [""],
        },
        {
            name: "Dr Mithika Mwenda",
            role: "Pan-African Climate Justice Alliance",
            image: "",
            bio: "",
            expertise: [""],
        },
        {
            name: "Mr Thomas Lerenten",
            role: "Adaptation Lead - Ministry of Environment, Kenya",
            image: "",
            bio: "",
            expertise: [""],
        },
    ]

    return (
        <>
            <LamaNavbar />
            <div className="min-h-screen bg-white">
                {/* Background Decorations */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-32 right-20 w-64 h-64 bg-gradient-to-br from-green-50 to-emerald-50 rounded-full blur-3xl opacity-40"></div>
                    <div className="absolute bottom-32 left-20 w-72 h-72 bg-gradient-to-tr from-blue-50 to-sky-50 rounded-full blur-3xl opacity-30"></div>
                </div>

                <div className="relative z-10">
                    {/* Hero Section */}
                    <section className="py-16 bg-gradient-to-br from-green-50 to-emerald-50">
                        <div className="container mx-auto px-6">
                            <div className="max-w-6xl mx-auto text-center">
                                <div className="inline-flex items-center gap-2 bg-white border border-green-200 rounded-full px-4 py-2 mb-6">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="text-green-700 text-sm font-medium">Expert Advisory Group</span>
                                </div>
                                <h1 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4 leading-tight">
                                    Advisory{" "}
                                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                        Members
                                    </span>
                                </h1>
                                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                                    Composed of ten experts from diverse backgrounds (including the African Group of Negotiators,
                                    research, private sector, government, and local communities), this group will consolidate best
                                    practices and indicators. The expert group will also play a crucial role in linking local metrics to
                                    national and international frameworks, supporting the African Group of Negotiators&apos; contributions
                                    to the Global Goal on Adaptation, and informing IPCC assessments.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Advisory Members Grid */}
                    <section className="py-16">
                        <div className="container mx-auto px-6">
                            <div className="max-w-7xl mx-auto">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {advisoryMembers.map((member, index) => (
                                        <div
                                            key={index}
                                            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100"
                                        >
                                            <div className="md:flex">
                                                <div className="md:w-1/3 bg-gradient-to-br from-green-50 to-emerald-50 p-8 flex items-center justify-center">
                                                    {member.image && (
                                                        <Image
                                                            src={member.image || "/placeholder.svg"}
                                                            alt={member.name}
                                                            width={160}
                                                            height={160}
                                                            className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg"
                                                        />
                                                    )}
                                                </div>
                                                <div className="md:w-2/3 p-8">
                                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                                                    <p className="text-green-600 font-medium mb-4 text-sm">{member.role}</p>
                                                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.bio}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
            <LamaFooter />
        </>
    )
}

export default AdvisoryPage
