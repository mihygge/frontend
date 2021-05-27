import { GetApi }  from './Get.api'

const GetFacilityType = () => (GetApi('/facility_types'))

export default GetFacilityType