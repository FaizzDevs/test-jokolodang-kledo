import { Building2, ChevronDown, ChevronRight, Filter, Github, Globe, Loader2, Map, MapPin, XCircle } from "lucide-react"
import React from "react"
import { Form, useLoaderData, useNavigation, useSearchParams, useSubmit } from "react-router-dom"

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
    const provinces = [
        { id: 1, name: "Kepulauan Riau" },
        { id: 2, name: "DKI Jakarta" },
        { id: 3, name: "Bali" }
    ]

    const regencies = [
        { id: 1, name: "Kota Batam", province_id: 1 },
        { id: 2, name: "Kota Tanjung Pinang", province_id: 1 },
        { id: 3, name: "Jakarta Selatan", province_id: 2 },
        { id: 4, name: "Jakarta Barat", province_id: 2 },
        { id: 5, name: "Kota Denpasar", province_id: 3 },
        { id: 6, name: "Badung", province_id: 3 }
    ]

    const districts = [
        { id: 1, name: "Batam Kota", regency_id: 1 },
        { id: 2, name: "Batu Ampar", regency_id: 1 },
        { id: 3, name: "Belakang Padang", regency_id: 1 },
        { id: 4, name: "Bukit Bestari", regency_id: 2 },
        { id: 5, name: "Tanjung Pinang Barat", regency_id: 2 },
        { id: 6, name: "Tanjung Pinang Kota", regency_id: 2 },
        { id: 7, name: "Kebayoran Baru", regency_id: 3 },
        { id: 8, name: "Kebayoran Lama", regency_id: 3 },
        { id: 9, name: "Cilandak", regency_id: 3 },
        { id: 10, name: "Kebon Jeruk", regency_id: 4 },
        { id: 11, name: "Tamansari", regency_id: 4 },
        { id: 12, name: "Grogol Petamburan", regency_id: 4 },
        { id: 13, name: "Denpasar Selatan", regency_id: 5 },
        { id: 14, name: "Denpasar Barat", regency_id: 5 },
        { id: 15, name: "Denpasar Utara", regency_id: 5 },
        { id: 16, name: "Kuta", regency_id: 6 },
        { id: 17, name: "Kuta Selatan", regency_id: 6 },
        { id: 18, name: "Kuta Utara", regency_id: 6 }
    ]

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ provinces, regencies, districts })
        }, 500)
    })
}

function useRegionData() {
    const { provinces, regencies, districts } = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const submit = useSubmit()
    const navigation = useNavigation()

    const selectedProvince = searchParams.get('province') || ''
    const selectedRegency = searchParams.get('regency') || ''
    const selectedDistrict = searchParams.get('district') || ''

    const filteredRegencies = regencies.filter(
        regency => regency.province_id === parseInt(selectedProvince)
    )

    const filteredDistricts = districts.filter(
        district => district.regency_id === parseInt(selectedRegency)
    )

    const getProvinceName = () => {
        const province = provinces.find(p => p.id === parseInt(selectedProvince))
        return province?.name || ''
    }

    const getRegencyName = () => {
        const regency = regencies.find(r => r.id === parseInt(selectedRegency))
        return regency?.name || ''
    }

    const getDistrictName = () => {
        const district = districts.find(d => d.id === parseInt(selectedDistrict))
        return district?.name || ''
    }

    const handleFilterChange = (e) => {
        const form = e.currentTarget.form
        const formData = new FormData(form)

        if (e.target.name === 'province') {
            formData.delete('regency')
            formData.delete('district')
        }

        if (e.target.name === 'regency') {
            formData.delete('district')
        }

        submit(formData, { method: 'get' })
    }

    const handleReset = () => {
        setSearchParams({})
    }

    const isLoading = navigation.state === 'loading'

    React.useEffect(() => {
        if (!selectedProvince && (selectedRegency || selectedDistrict)) {
            setSearchParams({})
        } else if (!selectedRegency && selectedDistrict) {
            const params = new URLSearchParams(searchParams)
            params.delete('district')
            setSearchParams(params)
        }
    }, [selectedProvince, selectedRegency, selectedDistrict, setSearchParams, searchParams])

    return {
        provinces,
        regencies,
        districts,
        filteredRegencies,
        filteredDistricts,
        selectedProvince,
        selectedRegency,
        selectedDistrict,
        getProvinceName,
        getRegencyName,
        getDistrictName,
        handleFilterChange,
        handleReset,
        isLoading
    }
}

function Sidebar({ 
    provinces, 
    filteredRegencies, 
    filteredDistricts, 
    selectedProvince, 
    selectedRegency, 
    selectedDistrict,
    handleFilterChange,
    handleReset,
    isLoading 
}) {
    return (
        <aside className="w-80 border-r border-gray-100 p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-12">
                <div className="bg-blue-50 p-2 rounded-full">
                    <Globe className="w-6 h-6 text-blue-500" />
                </div>
                <h1 className="text-xl font-bold text-gray-800">
                    Frontend Assessment
                </h1>
            </div>

            <div className="flex-grow">
                <p className="text-[10px] flex items-center gap-2 font-bold tracking-widest text-gray-400 mb-6 uppercase">
                    <Filter className="w-3 h-3" />
                    Filter Wilayah
                </p>

                <Form method="get" className="space-y-6">
                    <SelectField
                        id="province"
                        name="province"
                        label="Provinsi"
                        value={selectedProvince}
                        onChange={handleFilterChange}
                        disabled={isLoading}
                        icon={<Map className="h-5 w-5" />}
                    >
                        <option value="">Pilih Provinsi</option>
                        {provinces.map(province => (
                            <option key={province.id} value={province.id}>
                                {province.name}
                            </option>
                        ))}
                    </SelectField>

                    <SelectField
                        id="regency"
                        name="regency"
                        label="Kota/Kabupaten"
                        value={selectedRegency}
                        onChange={handleFilterChange}
                        disabled={!selectedProvince || isLoading}
                        icon={<Building2 className="h-5 w-5" />}
                    >
                        <option value="">Pilih Kota/Kabupaten</option>
                        {filteredRegencies.map(regency => (
                            <option value={regency.id} key={regency.id}>
                                {regency.name}
                            </option>
                        ))}
                    </SelectField>

                    <SelectField
                        id="district"
                        name="district"
                        label="Kecamatan"
                        value={selectedDistrict}
                        onChange={handleFilterChange}
                        disabled={!selectedRegency || isLoading}
                        icon={<MapPin className="h-5 w-5" />}
                    >
                        <option value="">Pilih Kecamatan</option>
                        {filteredDistricts.map(district => (
                            <option value={district.id} key={district.id}>
                                {district.name}
                            </option>
                        ))}
                    </SelectField>

                    <div className="mt-auto pt-8">
                        <button
                            type="button"
                            onClick={handleReset}
                            className="w-full flex items-center justify-center gap-2 py-4 border border-blue-500 text-blue-500 font-bold text-xs uppercase tracking-widest hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed rounded-xl"
                            disabled={isLoading}
                        >
                            <XCircle className="h-4 w-4" />
                            Reset
                        </button>
                    </div>
                </Form>

                <GitHubLink />
            </div>
        </aside>
    )
}

function SelectField({ id, name, label, value, onChange, disabled, icon, children }) {
    return (
        <div className="space-y-2">
            <label htmlFor={id} className="text-[10px] font-bold tracking-wider text-gray-500 uppercase">
                {label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                    {icon}
                </span>
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-blue-500 focus:border-blue-500 appearance-none text-sm font-medium disabled:bg-gray-50 disabled:text-gray-500"
                    disabled={disabled}
                >
                    {children}
                </select>
                <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <ChevronDown className="h-4 w-4" />
                </span>
            </div>
        </div>
    )
}

function GitHubLink() {
    return (
        <div className="mt-6 pt-6 border-t border-gray-100">
            <a
                href="https://github.com/username/repo"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs text-gray-500 hover:text-blue-500 transition-colors"
            >
                <Github className="w-4 h-4" />
                <span>View on Github</span>
            </a>
        </div>
    )
}

function Breadcrumb({ 
    selectedProvince, 
    selectedRegency, 
    selectedDistrict,
    getProvinceName,
    getRegencyName,
    getDistrictName 
}) {
    return (
        <nav className="border-r border-gray-100 px-10 py-4">
            <ol className="flex items-center space-x-2 text-[13px] font-semibold">
                <li>
                    <span className={selectedProvince ? 'text-gray-400' : 'text-blue-500'}>
                        Indonesia
                    </span>
                </li>

                {getProvinceName() && (
                    <>
                        <li className="text-gray-300">
                            <ChevronRight className="w-3 h-3" />
                        </li>
                        <li>
                            <span className={selectedRegency ? 'text-gray-400' : 'text-blue-500'}>
                                {getProvinceName()}
                            </span>
                        </li>
                    </>
                )}

                {getRegencyName() && (
                    <>
                        <li className="text-gray-300">
                            <ChevronRight className="w-3 h-3" />
                        </li>
                        <li>
                            <span className={selectedDistrict ? 'text-gray-400' : 'text-blue-500'}>
                                {getRegencyName()}
                            </span>
                        </li>
                    </>
                )}

                {getDistrictName() && (
                    <>
                        <li className="text-gray-300">
                            <ChevronRight className="w-3 h-3" />
                        </li>
                        <li>
                            <span className="text-blue-500">{getDistrictName()}</span>
                        </li>
                    </>
                )}
            </ol>
        </nav>
    )
}

function HierarchyDisplay({ 
    isLoading,
    selectedProvince,
    selectedRegency,
    getProvinceName,
    getRegencyName,
    getDistrictName 
}) {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                <p className="text-gray-500 font-medium">memuat data...</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center text-center">
            <HierarchyLevel
                label="Provinsi"
                value={getProvinceName()}
                showArrow={selectedProvince}
            />

            {selectedProvince && (
                <>
                    <HierarchyLevel
                        label="Kota / Kabupaten"
                        value={getRegencyName()}
                        showArrow={selectedRegency}
                    />
                </>
            )}

            {selectedRegency && (
                <HierarchyLevel
                    label="Kecamatan"
                    value={getDistrictName()}
                    isLast
                />
            )}
        </div>
    )
}

function HierarchyLevel({ label, value, showArrow, isLast }) {
    return (
        <>
            <div className={!isLast ? "mb-8" : ""}>
                <span className="text-[11px] font-bold tracking-widest text-blue-300 uppercase block mb-1">
                    {label}
                </span>
                <h2 className="text-6xl font-extrabold text-blue-400">
                    {value || '-'}
                </h2>
            </div>
            {showArrow && (
                <div className="mb-8 text-blue-200">
                    <ChevronDown className="h-8 w-8" />
                </div>
            )}
        </>
    )
}

export default function FilterPage() {
    const {
        provinces,
        filteredRegencies,
        filteredDistricts,
        selectedProvince,
        selectedRegency,
        selectedDistrict,
        getProvinceName,
        getRegencyName,
        getDistrictName,
        handleFilterChange,
        handleReset,
        isLoading
    } = useRegionData()

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="flex min-h-screen border border-gray-200 m-4 rounded-xl overflow-hidden shadow-sm bg-white">
                <Sidebar
                    provinces={provinces}
                    filteredRegencies={filteredRegencies}
                    filteredDistricts={filteredDistricts}
                    selectedProvince={selectedProvince}
                    selectedRegency={selectedRegency}
                    selectedDistrict={selectedDistrict}
                    handleFilterChange={handleFilterChange}
                    handleReset={handleReset}
                    isLoading={isLoading}
                />

                <main className="flex-grow flex flex-col">
                    <Breadcrumb
                        selectedProvince={selectedProvince}
                        selectedRegency={selectedRegency}
                        selectedDistrict={selectedDistrict}
                        getProvinceName={getProvinceName}
                        getRegencyName={getRegencyName}
                        getDistrictName={getDistrictName}
                    />

                    <div className="flex-grow flex flex-col items-center justify-center -mt-16">
                        <HierarchyDisplay
                            isLoading={isLoading}
                            selectedProvince={selectedProvince}
                            selectedRegency={selectedRegency}
                            getProvinceName={getProvinceName}
                            getRegencyName={getRegencyName}
                            getDistrictName={getDistrictName}
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}