<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;

class RegisterStoreRequest extends FormRequest
{
  /**
   * Determine if the user is authorized to make this request.
   *
   * @return bool
   */

  public function authorize()
  {
    return true;
  }

  /**
   * Get the validation rules that apply to the request.
   *
   * @return array
   */

  public function rules()
  {
    return [
      'main_tenant_salutation' => 'required',
      'main_tenant_lastname' => 'required',
      'main_tenant_firstname' => 'required',
      'main_tenant_street_number' => 'required',
      'main_tenant_postal_code_city' => 'required',
      'main_tenant_birthdate' => 'required|date',
      'main_tenant_marital_status' => 'required',
      'main_tenant_nationality' => 'required',
      'main_tenant_residence_permit' => 'required_if:main_tenant_nationality,Andere',
      'main_tenant_swiss_residence_since' => 'required_if:main_tenant_nationality,Andere',
      'main_tenant_home_town' => 'required_if:main_tenant_nationality,CH',
      'main_tenant_email' => 'required|email',
      'main_tenant_private_phone' => 'required',
      'main_tenant_occupation' => 'required',
      'main_tenant_employment_status' => 'required',
      'main_tenant_current_employer_name' => 'required_if:main_tenant_employment_status,Angestellt',
      'main_tenant_workload' => 'required_if:main_tenant_employment_status,Angestellt',
      'main_tenant_annual_income' => 'required_if:main_tenant_employment_status,Angestellt',
      'main_tenant_debt_enforcement_yn' => 'required',
      'main_tenant_current_rent_tenant_role' => 'required',
      'main_tenant_current_rent_terminator' => 'required',
      'main_tenant_current_rent_terminator_reason' => 'required_if:main_tenant_current_rent_terminator,Ja',
      'main_tenant_current_renter_name' => 'required',
      'main_tenant_current_renter_phone' => 'required',
      'main_tenant_current_renter_rent_duration' => 'required',
      'main_tenant_current_renter_previous_renter' => 'required_if:main_tenant_current_renter_rent_duration,Weniger als 1 Jahr',
      'sub_tenant_yn' => 'required',
      'sub_tenant_type' => 'required_if:sub_tenant_yn,Ja',
      'sub_tenant_salutation' => 'required_if:has_sub_tenant,true',
      'sub_tenant_lastname' => 'required_if:has_sub_tenant,true',
      'sub_tenant_firstname' => 'required_if:has_sub_tenant,true',
      'sub_tenant_same_adress' => 'required_if:has_sub_tenant,true',
      'sub_tenant_street' => 'required_if:sub_tenant_same_adress,Nein',
      'sub_tenant_postal_code_city' => 'required_if:sub_tenant_same_adress,Nein',
      'sub_tenant_birthdate' => 'required_if:has_sub_tenant,true',
      'sub_tenant_marital_status' => 'required_if:has_sub_tenant,true',
      'sub_tenant_nationality' => 'required_if:has_sub_tenant,true',
      'sub_tenant_residence_permit' => 'required_if:sub_tenant_nationality,Andere',
      'sub_tenant_swiss_residence_since' => 'required_if:sub_tenant_nationality,Andere',
      'sub_tenant_home_town' => 'required_if:sub_tenant_nationality,CH',
      'sub_tenant_private_phone' => 'required_if:has_sub_tenant,true',
      'sub_tenant_email' => 'required_if:has_sub_tenant,true',
      'sub_tenant_occupation' => 'required_if:has_sub_tenant,true',
      'sub_tenant_employment_status' => 'required_if:has_sub_tenant,true',
      'sub_tenant_current_employer_name' => 'required_if:sub_tenant_employment_status,Angestellt',
      'sub_tenant_workload' => 'required_if:sub_tenant_employment_status,Angestellt',
      'sub_tenant_annual_income' => 'required_if:sub_tenant_employment_status,Angestellt',
      'sub_tenant_debt_enforcement_yn' => 'required_if:has_sub_tenant,true',
      'sub_tenant_current_rent_tenant_role' => 'required_if:has_sub_tenant,true',
      'sub_tenant_current_rent_terminator' => 'required_if:has_sub_tenant,true',
      'sub_tenant_current_renter_name' => 'required_if:has_sub_tenant,true',
      'sub_tenant_current_renter_phone' => 'required_if:has_sub_tenant,true',
      'sub_tenant_current_renter_rent_duration' => 'required_if:has_sub_tenant,true',
      'sub_tenant_current_renter_previous_renter' => 'required_if:sub_tenant_current_renter_rent_duration,Weniger als 1 Jahr',
      'sub_tenant_current_rent_terminator_reason' => 'required_if:sub_tenant_current_rent_terminator,Ja',
      'rent_pref_district_id' => 'required|array|min:1',
      'rent_pref_floor_id' => 'required|array|min:1',
      'rent_pref_rooms_qty' => 'required|array|min:1',
      'rent_pref_nobalcony_yn' => 'required',
      'rent_pref_noelevator' => 'required',
      'rent_pref_max_rent' => 'required',
      'rent_pref_min_start_date' => 'required|date',
      'accomodation_play_music_yn' => 'required',
      'accomodation_musical_instruments' => 'required_if:accomodation_play_music_yn,Ja',
      'accomodation_pets_yn' => 'required',
      'accomodation_pets' => 'required_if:accomodation_pets_yn,Ja',
      'accomodation_total_persons' => 'required_if:sub_tenant_yn,Ja',
      'accomodation_adults_qty' => 'required_if:sub_tenant_yn,Ja',
      'accomodation_children_qty' => 'required_if:has_children,true',
      'accomodation_children_living_constantly' => 'required_if:has_children,true',
      'accomodation_children_age_group' => 'required_if:has_children,true',
    ];
  }

  /**
   * Custom message for validation
   *
   * @return array
   */

  public function messages()
  {
    return [
      'main_tenant_salutation.required' => 'Please select a salutation.',
      'main_tenant_lastname.required' => 'Please enter a last name.',
      'main_tenant_firstname.required' => 'Please enter a first name.',
      'main_tenant_street_number.required' => 'Please enter a street and number.',
      'main_tenant_postal_code_city.required' => 'Please enter a postal code and city.',
      'main_tenant_birthdate.required' => 'Please enter a birthdate.',
      'main_tenant_birthdate.date' => 'Please enter a valid birthdate.',
      'main_tenant_marital_status.required' => 'Please select a marital status.',
      'main_tenant_nationality.required' => 'Please select your nationality.',
      'main_tenant_residence_permit.required_if' => 'Please select your residence permit.',
      'main_tenant_swiss_residence_since.required_if' => 'Please select your residence in Switzerland.',
      'main_tenant_home_town.required_if' => 'Please enter your home town.',
      'main_tenant_email.required' => 'Please enter your email address.',
      'main_tenant_email.email' => 'Please enter a valid email address.',
      'main_tenant_private_phone.required' => 'Please enter your private phone number.',
      'main_tenant_occupation.required' => 'Please enter your occupation.',
      'main_tenant_employment_status.required' => 'Please select your employment status.',
      'main_tenant_current_employer_name.required_if' => 'Please enter your current employer name.',
      'main_tenant_workload.required_if' => 'Please enter your workload.',
      'main_tenant_annual_income.required_if' => 'Please enter your income.',
      'main_tenant_debt_enforcement_yn.required' => 'Please select if you have any debt enforcement.',
      'main_tenant_current_rent_tenant_role.required' => 'Please select your role in your current rent.',
      'main_tenant_current_rent_terminator.required' => 'Please select if you are the terminator of your current rent.',
      'main_tenant_current_rent_terminator_reason.required_if' => 'Please select the reason for the termination of your current rent.',
      'main_tenant_current_renter_name.required' => 'Please enter the name of your current renter.',
      'main_tenant_current_renter_phone.required' => 'Please enter the phone number of your current renter.',
      'main_tenant_current_renter_rent_duration.required' => 'Please enter the duration of your current rent.',
      'main_tenant_current_renter_previous_renter.required_if' => 'Please enter the name and phone number of your previous renter.',
      'sub_tenant_yn.required' => 'Please select if you have a sub tenant.',
      'sub_tenant_type.required_if' => 'Please select the type of your sub tenant.',
      'sub_tenant_salutation.required_if' => 'Please select a salutation.',
      'sub_tenant_lastname.required_if' => 'Please enter a last name.',
      'sub_tenant_firstname.required_if' => 'Please enter a first name.',
      'sub_tenant_same_adress.required_if' => 'Please select if your sub tenant has the same adress.',
      'sub_tenant_street.required_if' => 'Please enter a street.',
      'sub_tenant_postal_code_city.required_if' => 'Please enter a postal code and city.',
      'sub_tenant_birthdate.required_if' => 'Please enter a birthdate.',
      'sub_tenant_marital_status.required_if' => 'Please select a marital status.',
      'sub_tenant_nationality.required_if' => 'Please select your sub tenants nationality',
      'sub_tenant_home_town.required_if' => 'Please enter your sub tenants home town.',
      'sub_tenant_private_phone.required_if' => 'Please enter your sub tenants private phone number.',
      'sub_tenant_email.required_if' => 'Please enter your sub tenants email address.',
      'sub_tenant_occupation.required_if' => 'Please enter your sub tenants occupation.',
      'sub_tenant_employment_status.required_if' => 'Please select your sub tenants employment status.',
      'sub_tenant_current_employer_name.required_if' => 'Please enter your sub tenants current employer name.',
      'sub_tenant_workload.required_if' => 'Please enter your sub tenants workload.',
      'sub_tenant_annual_income.required_if' => 'Please enter your sub tenants income.',
      'sub_tenant_debt_enforcement_yn.required_if' => 'Please select if your sub tenant has any debt enforcement.',
      'sub_tenant_current_rent_tenant_role.required_if' => 'Please select your sub tenants role in his current rent.',
      'sub_tenant_current_rent_terminator.required_if' => 'Please select if your sub tenant is the terminator of his current rent.',
      'sub_tenant_current_renter_name.required_if' => 'Please enter the name of your sub tenants current renter.',
      'sub_tenant_current_renter_phone.required_if' => 'Please enter the phone number of your sub tenants current renter.',
      'sub_tenant_current_renter_rent_duration.required_if' => 'Please enter the duration of your sub tenants current rent.',
      'sub_tenant_current_renter_previous_renter.required_if' => 'Please select if your sub tenant was the previous renter of his current rent.',
      'sub_tenant_current_rent_terminator_reason.required_if' => 'Please select the reason for the termination of your sub tenants current rent.',
      'sub_tenant_residence_permit.required_if' => 'Please select your sub tenants residence permit.',
      'sub_tenant_swiss_residence_since.required_if' => 'Please select your sub tenants residence.',
      'rent_pref_district_id.required' => 'Please select at least one district.',
      'rent_pref_floor_id.required' => 'Please select at least one floor.',
      'rent_pref_rooms_qty.required' => 'Please select at least one room.',
      'rent_pref_nobalcony_yn.required' => 'Please select if you want a balcony.',
      'rent_pref_noelevator.required' => 'Please select if you want an elevator.',
      'rent_pref_max_rent.required' => 'Please enter your maximum rent.',
      'rent_pref_min_start_date.required' => 'Please enter your minimum start date.',
      'rent_pref_min_start_date.date' => 'Please enter a valid date.',
      'accomodation_play_music_yn.required' => 'Please select if you play music.',
      'accomodation_musical_instruments.required_if' => 'Please select your musical instruments.',
      'accomodation_pets_yn.required' => 'Please select if you have pets.',
      'accomodation_pets.required_if' => 'Please select your pets.',
      'accomodation_total_persons.required_if' => 'Please enter the total number of persons.',
      'accomodation_adults_qty.required_if' => 'Please enter the number of adults.',
      'accomodation_children_qty.required_if' => 'Please enter the number of children.',
      'accomodation_children_living_constantly.required_if' => 'Please enter the number of children living constantly.',
      'accomodation_children_age_group.required_if' => 'Please select the age group of your children.',
    ];
  }
}