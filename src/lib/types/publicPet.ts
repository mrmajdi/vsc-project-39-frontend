// تعریف انواع برای پاسپورت عمومی حیوان
export interface PublicPet {
  id: number;
  unique_code: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  birth_date: string;
  photo_url: string;
  allergies: string[];
  vaccines: {
    name: string;
    date: string;
  }[];
  medical_notes: string;
  owner_phone: string;
  owner_name: string;
  last_seen_location?: {
    lat: number;
    lng: number;
    address: string;
  };
}

export type PublicPetResponse = PublicPet;
