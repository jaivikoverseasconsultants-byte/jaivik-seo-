// Server-side course registry — maps university slugs to normalized course arrays.
// Used by the generic [slug]/page.tsx to pass rich course data to UniversityCoursesSection.
// This file is server-only (imported only in Server Components); it never ships to the client bundle.

import { aalborgUniversityCourses as m_aalborg_university } from './aalborg-university-courses';
import { aarhusUniversityCourses as m_aarhus_university } from './aarhus-university-courses';
import { acadiaCourses as m_acadia_university } from './acadia-courses';
import { aixMarseilleUniversityCourses as m_aix_marseille_university } from './aix-marseille-university-courses';
import { algonquinCourses as m_algonquin_college } from './algonquin-courses';
import { americanCourses as m_american_university } from './american-courses';
import { americanUniversityDubaiCourses as m_american_university_dubai } from './american-university-dubai-courses';
import { americanUniversityOfSharjahCourses as m_american_university_of_sharjah } from './american-university-of-sharjah-courses';
import { amityUniversityDubaiCourses as m_amity_university_dubai } from './amity-university-dubai-courses';
import { amsterdamUniversityOfAppliedSciencesCourses as m_amsterdam_university_of_applied_sciences } from './amsterdam-university-of-applied-sciences-courses';
import { aruCourses as m_anglia_ruskin_university } from './aru-courses';
import { asuCourses as m_arizona_state_university } from './asu-courses';
import { assiniboineCourses as m_assiniboine_college } from './assiniboine-courses';
import { astonCourses as m_aston_university } from './aston-courses';
import { atuCourses as m_atlantic_technological_university } from './atu-courses';
import { autCourses as m_auckland_university_of_technology } from './aut-courses';
import { acuCourses as m_australian_catholic_university } from './acu-courses';
import { anuCourses as m_australian_national_university } from './anu-courses';
import { autonomousUniversityOfBarcelonaCourses as m_autonomous_university_of_barcelona } from './autonomous-university-of-barcelona-courses';
import { autonomousUniversityOfMadridCourses as m_autonomous_university_of_madrid } from './autonomous-university-of-madrid-courses';
import { bangorCourses as m_bangor_university } from './bangor-courses';
import { bcuCourses as m_birmingham_city_university } from './bcu-courses';
import { bitsPilaniDubaiCourses as m_bits_pilani_dubai } from './bits-pilani-dubai-courses';
import { bocconiUniversityCourses as m_bocconi_university } from './bocconi-university-courses';
import { bondCourses as m_bond_university } from './bond-courses';
import { buCourses as m_boston_university } from './bu-courses';
import { bmouthCourses as m_bournemouth_university } from './bmouth-courses';
import { bow_valleyCourses as m_bow_valley_college } from './bow-valley-courses';
import { brandon_universityCourses as m_brandon_university } from './brandon-university-courses';
import { brockCourses as m_brock_university } from './brock-courses';
import { brownCourses as m_brown_university } from './brown-courses';
import { brunelCourses as m_brunel_university_london } from './brunel-courses';
import { businessAcademyAarhusCourses as m_business_academy_aarhus } from './business-academy-aarhus-courses';
import { caFoscariUniversityVeniceCourses as m_ca_foscari_university_venice } from './ca-foscari-university-venice-courses';
import { caltechCourses as m_caltech } from './caltech-courses';
import { cambrianCourses as m_cambrian_college } from './cambrian-courses';
import { canadianUniversityDubaiCourses as m_canadian_university_dubai } from './canadian-university-dubai-courses';
import { canadoreCourses as m_canadore_college } from './canadore-courses';
import { cbuCourses as m_cape_breton_university } from './cbu-courses';
import { capilanoCourses as m_capilano_university } from './capilano-courses';
import { cardiffCourses as m_cardiff_university } from './cardiff-courses';
import { carletonCourses as m_carleton_university } from './carleton-courses';
import { carlosIiiUniversityMadridCourses as m_carlos_iii_university_madrid } from './carlos-iii-university-madrid-courses';
import { cmuCourses as m_carnegie_mellon_university } from './cmu-courses';
import { cwruCourses as m_case_western_reserve_university } from './cwru-courses';
import { centennialCourses as m_centennial_college } from './centennial-courses';
import { chalmersUniversityCourses as m_chalmers_university } from './chalmers-university-courses';
import { cduCourses as m_charles_darwin_university } from './cdu-courses';
import { cityCourses as m_city_university_london } from './city-courses';
import { clarkuCourses as m_clark_university } from './clarku-courses';
import { borealCourses as m_college_boreal } from './boreal-courses';
import { college_of_rockiesCourses as m_college_of_the_rockies } from './college-of-rockies-courses';
import { colostateCourses as m_colorado_state_university } from './colostate-courses';
import { columbia_college_bcCourses as m_columbia_college } from './columbia-college-bc-courses';
import { columbiaCourses as m_columbia_university } from './columbia-courses';
import { complutenseUniversityMadridCourses as m_complutense_university_madrid } from './complutense-university-madrid-courses';
import { concordiaCourses as m_concordia_university } from './concordia-courses';
import { concordia_edmontonCourses as m_concordia_university_edmonton } from './concordia-edmonton-courses';
import { conestogaCourses as m_conestoga_college } from './conestoga-courses';
import { confederationCourses as m_confederation_college } from './confederation-courses';
import { copenhagenBusinessSchoolCourses as m_copenhagen_business_school } from './copenhagen-business-school-courses';
import { cornellCourses as m_cornell_university } from './cornell-courses';
import { coventryCourses as m_coventry_university } from './coventry-courses';
import { cquCourses as m_cquniversity } from './cqu-courses';
import { curtinsgCourses as m_curtin_singapore } from './curtinsg-courses';
import { curtinCourses as m_curtin_university } from './curtin-courses';
import { dalCourses as m_dalhousie_university } from './dal-courses';
import { daniaAcademyCourses as m_dania_academy } from './dania-academy-courses';
import { dartmouthCourses as m_dartmouth_college } from './dartmouth-courses';
import { demontfortCourses as m_de_montfort_university } from './demontfort-courses';
import { deakinCourses as m_deakin_university } from './deakin-courses';
import { delftCourses as m_delft_university_of_technology } from './delft-courses';
import { depaulCourses as m_depaul_university } from './depaul-courses';
import { douglasCourses as m_douglas_college } from './douglas-courses';
import { drexelCourses as m_drexel_university } from './drexel-courses';
import { dbsCourses as m_dublin_business_school } from './dbs-courses';
import { dcuCourses as m_dublin_city_university } from './dcu-courses';
import { dukeCourses as m_duke_university } from './duke-courses';
import { durhamCourses as m_durham_college } from './durham-courses';
import { durhamuniCourses as m_durham_university } from './durhamuni-courses';
import { eaBusinessAcademyCourses as m_ea_business_academy } from './ea-business-academy-courses';
import { eaeBusinessSchoolCourses as m_eae_business_school } from './eae-business-school-courses';
import { ecolePolytechniqueCourses as m_ecole_polytechnique } from './ecole-polytechnique-courses';
import { ecuCourses as m_edith_cowan_university } from './ecu-courses';
import { eindhovenCourses as m_eindhoven_university_of_technology } from './eindhoven-courses';
import { embryCourses as m_embry_riddle_singapore } from './embry-courses';
import { emlyonBusinessSchoolCourses as m_emlyon_business_school } from './emlyon-business-school-courses';
import { emoryCourses as m_emory_university } from './emory-courses';
import { erasmusUniversityRotterdamCourses as m_erasmus_university_rotterdam } from './erasmus-university-rotterdam-courses';
import { esadeBusinessSchoolCourses as m_esade_business_school } from './esade-business-school-courses';
import { essecBusinessSchoolCourses as m_essec_business_school } from './essec-business-school-courses';
import { fduusCourses as m_fairleigh_dickinson_university } from './fduus-courses';
import { fdu_vancouverCourses as m_fairleigh_dickinson_university_vancouver } from './fdu-vancouver-courses';
import { fanshaweCourses as m_fanshawe_college } from './fanshawe-courses';
import { federationCourses as m_federation_university } from './federation-courses';
import { fnunivCourses as m_first_nations_university } from './fnuniv-courses';
import { flemingCourses as m_fleming_college } from './fleming-courses';
import { flindersCourses as m_flinders_university } from './flinders-courses';
import { fordhamCourses as m_fordham_university } from './fordham-courses';
import { fuberlinCourses as m_free_university_berlin } from './fu-berlin-courses';
import { fuberlinCourses as m_free_university_of_berlin } from './fu-berlin-courses';
import { george_brownCourses as m_george_brown_college } from './george-brown-courses';
import { gwuCourses as m_george_washington_university } from './gwu-courses';
import { georgetownCourses as m_georgetown_university } from './georgetown-courses';
import { gatechCourses as m_georgia_institute_of_technology } from './gatech-courses';
import { gatechCourses as m_georgia_tech } from './gatech-courses';
import { georgianCourses as m_georgian_college } from './georgian-courses';
import { goetheCourses as m_goethe_university_frankfurt } from './goethe-courses';
import { goldCourses as m_goldsmiths_university_london } from './gold-courses';
import { gprcCourses as m_grande_prairie_regional_college } from './gprc-courses';
import { gcdCourses as m_griffith_college_dublin } from './gcd-courses';
import { griffithCourses as m_griffith_university } from './griffith-courses';
import { halmstadUniversityCourses as m_halmstad_university } from './halmstad-university-courses';
import { hanUniversityCourses as m_han_university } from './han-university-courses';
import { harvardCourses as m_harvard_university } from './harvard-courses';
import { heidelbergCourses as m_heidelberg_university } from './heidelberg-courses';
import { hwCourses as m_heriot_watt_university } from './hw-courses';
import { heriotWattUniversityDubaiCourses as m_heriot_watt_university_dubai } from './heriot-watt-university-dubai-courses';
import { hollandCourses as m_holland_college } from './holland-courses';
import { holmesCourses as m_holmes_institute } from './holmes-courses';
import { humberCourses as m_humber_college } from './humber-courses';
import { humboldtCourses as m_humboldt_university_berlin } from './humboldt-courses';
import { humboldtCourses as m_humboldt_university_of_berlin } from './humboldt-courses';
import { ibaKoldingCourses as m_iba_kolding } from './iba-kolding-courses';
import { ieUniversityCourses as m_ie_university } from './ie-university-courses';
import { ieseBusinessSchoolCourses as m_iese_business_school } from './iese-business-school-courses';
import { illinoistechCourses as m_illinois_tech } from './illinoistech-courses';
import { iuCourses as m_indiana_university } from './iu-courses';
import { inseadCourses as m_insead } from './insead-courses';
import { iowastateCourses as m_iowa_state_university } from './iowastate-courses';
import { itUniversityOfCopenhagenCourses as m_it_university_of_copenhagen } from './it-university-of-copenhagen-courses';
import { jcusgCourses as m_james_cook_university_singapore } from './jcusg-courses';
import { jcu_brisbaneCourses as m_jcu_brisbane } from './jcu-brisbane-courses';
import { jhuCourses as m_johns_hopkins_university } from './jhu-courses';
import { jonkopingUniversityCourses as m_jonkoping_university } from './jonkoping-university-courses';
import { jibcCourses as m_justice_institute_of_bc } from './jibc-courses';
import { kaplanCourses as m_kaplan_business_school } from './kaplan-courses';
import { kaplansgCourses as m_kaplan_singapore } from './kaplansg-courses';
import { kitCourses as m_karlsruhe_institute_of_technology } from './kit-courses';
import { karolinskaInstitutetCourses as m_karolinska_institutet } from './karolinska-institutet-courses';
import { khalifaUniversityCourses as m_khalifa_university } from './khalifa-university-courses';
import { kclCourses as m_kings_college_london } from './kcl-courses';
import { kingstonCourses as m_kingston_university_london } from './kingston-courses';
import { kthRoyalInstituteOfTechnologyCourses as m_kth_royal_institute_of_technology } from './kth-royal-institute-of-technology-courses';
import { kpuCourses as m_kwantlen_polytechnic_university } from './kpu-courses';
import { la_citeCourses as m_la_cite_college } from './la-cite-courses';
import { latrobeCourses as m_la_trobe_university } from './latrobe-courses';
import { lakeheadCourses as m_lakehead_university } from './lakehead-courses';
import { lakeland_collegeCourses as m_lakeland_college } from './lakeland-college-courses';
import { lambtonCourses as m_lambton_college } from './lambton-courses';
import { lancsCourses as m_lancaster_university } from './lancs-courses';
import { langaraCourses as m_langara_college } from './langara-courses';
import { laurentianCourses as m_laurentian_university } from './laurentian-courses';
import { leedsBeckettCourses as m_leeds_beckett_university } from './leeds-beckett-courses';
import { leidenUniversityCourses as m_leiden_university } from './leiden-university-courses';
import { lincolnnzCourses as m_lincoln_university_new_zealand } from './lincolnnz-courses';
import { linkopingUniversityCourses as m_linkoping_university } from './linkoping-university-courses';
import { ljmuCourses as m_liverpool_john_moores_university } from './ljmu-courses';
import { lmuCourses as m_lmu_munich } from './lmu-courses';
import { londonmetCourses as m_london_metropolitan_university } from './londonmet-courses';
import { lseCourses as m_london_school_of_economics } from './lse-courses';
import { lsbuCourses as m_london_south_bank_university } from './lsbu-courses';
import { lboroCourses as m_loughborough_university } from './lboro-courses';
import { loyalistCourses as m_loyalist_college } from './loyalist-courses';
import { luissUniversityCourses as m_luiss_university } from './luiss-university-courses';
import { lundUniversityCourses as m_lund_university } from './lund-university-courses';
import { maastrichtUniversityCourses as m_maastricht_university } from './maastricht-university-courses';
import { macewanCourses as m_macewan_university } from './macewan-courses';
import { macqCourses as m_macquarie_university } from './macq-courses';
import { malardalenUniversityCourses as m_malardalen_university } from './malardalen-university-courses';
import { mmuCourses as m_manchester_metropolitan_university } from './mmu-courses';
import { manipalDubaiCourses as m_manipal_dubai } from './manipal-dubai-courses';
import { masseyCourses as m_massey_university } from './massey-courses';
import { muCourses as m_maynooth_university } from './mu-courses';
import { mcgillCourses as m_mcgill_university } from './mcgill-courses';
import { mcmasterCourses as m_mcmaster_university } from './mcmaster-courses';
import { mdisCourses as m_mdis_singapore } from './mdis-courses';
import { medicine_hatCourses as m_medicine_hat_college } from './medicine-hat-courses';
import { munCourses as m_memorial_university } from './mun-courses';
import { msuCourses as m_michigan_state_university } from './msu-courses';
import { midSwedenUniversityCourses as m_mid_sweden_university } from './mid-sweden-university-courses';
import { middlesexCourses as m_middlesex_university } from './middlesex-courses';
import { middlesexUniversityDubaiCourses as m_middlesex_university_dubai } from './middlesex-university-dubai-courses';
import { mitCourses as m_mit_massachusetts } from './mit-courses';
import { mohawkCourses as m_mohawk_college } from './mohawk-courses';
import { monashCourses as m_monash_university } from './monash-courses';
import { mount_allisonCourses as m_mount_allison_university } from './mount-allison-courses';
import { mruCourses as m_mount_royal_university } from './mru-courses';
import { mtuCourses as m_munster_technological_university } from './mtu-courses';
import { murdochCourses as m_murdoch_university } from './murdoch-courses';
import { murdochUniversityDubaiCourses as m_murdoch_university_dubai } from './murdoch-university-dubai-courses';
import { murdochsgCourses as m_murdoch_university_singapore } from './murdochsg-courses';
import { ntuCourses as m_nanyang_technological_university } from './ntu-courses';
import { nciCourses as m_national_college_of_ireland } from './nci-courses';
import { nusCourses as m_national_university_of_singapore } from './nus-courses';
import { navitasCourses as m_navitas_australia } from './navitas-courses';
import { nbccCourses as m_nbcc } from './nbcc-courses';
import { ncstateCourses as m_nc_state_university } from './ncstate-courses';
import { nyuCourses as m_new_york_university } from './nyu-courses';
import { nclCourses as m_newcastle_university } from './ncl-courses';
import { niagara_collegeCourses as m_niagara_college } from './niagara-college-courses';
import { niagara_universityCourses as m_niagara_university } from './niagara-university-courses';
import { norquestCourses as m_norquest_college } from './norquest-courses';
import { north_islandCourses as m_north_island_college } from './north-island-courses';
import { northeasternCourses as m_northeastern_university } from './northeastern-courses';
import { northern_collegeCourses as m_northern_college } from './northern-college-courses';
import { northumbriaCourses as m_northumbria_university } from './northumbria-courses';
import { nwesternCourses as m_northwestern_university } from './nwestern-courses';
import { notredameCourses as m_notre_dame_university } from './notredame-courses';
import { nottinghamtrentCourses as m_nottingham_trent_university } from './nottinghamtrent-courses';
import { nsccCourses as m_nscc } from './nscc-courses';
import { nyit_vancouverCourses as m_nyit_vancouver } from './nyit-vancouver-courses';
import { osuCourses as m_ohio_state_university } from './osu-courses';
import { okanaganCourses as m_okanagan_college } from './okanagan-courses';
import { olds_collegeCourses as m_olds_college } from './olds-college-courses';
import { ontario_techCourses as m_ontario_tech_university } from './ontario-tech-courses';
import { brookesCourses as m_oxford_brookes_university } from './brookes-courses';
import { paceCourses as m_pace_university } from './pace-courses';
import { pennstateCourses as m_penn_state_university } from './pennstate-courses';
import { politecnicoDiMilanoCourses as m_politecnico_di_milano } from './politecnico-di-milano-courses';
import { politecnicoDiTorinoCourses as m_politecnico_di_torino } from './politecnico-di-torino-courses';
import { pompeuFabraUniversityCourses as m_pompeu_fabra_university } from './pompeu-fabra-university-courses';
import { portage_collegeCourses as m_portage_college } from './portage-college-courses';
import { princetonCourses as m_princeton_university } from './princeton-courses';
import { psbsgCourses as m_psb_academy } from './psbsg-courses';
import { purdueCourses as m_purdue_university } from './purdue-courses';
import { qmulCourses as m_queen_mary_university_london } from './qmul-courses';
import { queensCourses as m_queens_university } from './queens-courses';
import { radboudUniversityCourses as m_radboud_university } from './radboud-university-courses';
import { rcsiCourses as m_rcsi_university_of_medicine } from './rcsi-courses';
import { red_deer_polyCourses as m_red_deer_polytechnic } from './red-deer-poly-courses';
import { red_riverCourses as m_red_river_college_polytechnic } from './red-river-courses';
import { rpiCourses as m_rensselaer_polytechnic } from './rpi-courses';
import { riceCourses as m_rice_university } from './rice-courses';
import { ritDubaiCourses as m_rit_dubai } from './rit-dubai-courses';
import { rmitsgCourses as m_rmit_singapore } from './rmitsg-courses';
import { rmitCourses as m_rmit_university } from './rmit-courses';
import { rguCourses as m_robert_gordon_university } from './rgu-courses';
import { ritCourses as m_rochester_institute_of_technology } from './rit-courses';
import { roskildeUniversityCourses as m_roskilde_university } from './roskilde-university-courses';
import { rhulCourses as m_royal_holloway_university_london } from './rhul-courses';
import { royal_roadsCourses as m_royal_roads_university } from './royal-roads-courses';
import { rutgersCourses as m_rutgers_university } from './rutgers-courses';
import { rwthCourses as m_rwth_aachen_university } from './rwth-courses';
import { saitCourses as m_sait } from './sait-courses';
import { sapienzaUniversityRomeCourses as m_sapienza_university_rome } from './sapienza-university-rome-courses';
import { sask_polyCourses as m_saskatchewan_polytechnic } from './sask-poly-courses';
import { sault_collegeCourses as m_sault_college } from './sault-college-courses';
import { sciencesPoParisCourses as m_sciences_po_paris } from './sciences-po-paris-courses';
import { selkirkCourses as m_selkirk_college } from './selkirk-courses';
import { senecaCourses as m_seneca_polytechnic } from './seneca-courses';
import { sheffieldHallamCourses as m_sheffield_hallam_university } from './sheffield-hallam-courses';
import { sheridanCourses as m_sheridan_college } from './sheridan-courses';
import { simsgCourses as m_sim_singapore } from './simsg-courses';
import { sfuCourses as m_simon_fraser_university } from './sfu-courses';
import { sitCourses as m_singapore_institute_of_technology } from './sit-courses';
import { smuCourses as m_singapore_management_university } from './smu-courses';
import { sluSwedenCourses as m_slu_sweden } from './slu-sweden-courses';
import { sorbonneUniversityCourses as m_sorbonne_university } from './sorbonne-university-courses';
import { setuCourses as m_south_east_technological_university } from './setu-courses';
import { scuCourses as m_southern_cross_university } from './scu-courses';
import { spJainDubaiCourses as m_sp_jain_dubai } from './sp-jain-dubai-courses';
import { spjainCourses as m_sp_jain_singapore } from './spjain-courses';
import { st_clairCourses as m_st_clair_college } from './st-clair-courses';
import { st_lawrenceCourses as m_st_lawrence_college } from './st-lawrence-courses';
import { st_thomasCourses as m_st_thomas_university } from './st-thomas-courses';
import { staffsCourses as m_staffordshire_university } from './staffs-courses';
import { stanfordCourses as m_stanford_university } from './stanford-courses';
import { stevensCourses as m_stevens_institute_of_technology } from './stevens-courses';
import { stockholmSchoolOfEconomicsCourses as m_stockholm_school_of_economics } from './stockholm-school-of-economics-courses';
import { stockholmUniversityCourses as m_stockholm_university } from './stockholm-university-courses';
import { stonybrookCourses as m_stony_brook_university } from './stonybrook-courses';
import { sunybuffaloCourses as m_suny_buffalo } from './sunybuffalo-courses';
import { sutdCourses as m_sutd } from './sutd-courses';
import { swanseaCourses as m_swansea_university } from './swansea-courses';
import { swinburneCourses as m_swinburne_university } from './swinburne-courses';
import { tubCourses as m_technical_university_berlin } from './tub-courses';
import { technicalUniversityOfDenmarkCourses as m_technical_university_of_denmark } from './technical-university-of-denmark-courses';
import { tuMunichCourses as m_technical_university_of_munich } from './tu-munich-courses';
import { tudCourses as m_technological_university_dublin } from './tud-courses';
import { teesCourses as m_teesside_university } from './tees-courses';
import { templeCourses as m_temple_university } from './temple-courses';
import { tamuCourses as m_texas_am_university } from './tamu-courses';
import { thinkCourses as m_think_education_australia } from './think-courses';
import { truCourses as m_thompson_rivers_university } from './tru-courses';
import { tilburgUniversityCourses as m_tilburg_university } from './tilburg-university-courses';
import { tmuCourses as m_toronto_metropolitan_university } from './tmu-courses';
import { torrensCourses as m_torrens_university_australia } from './torrens-courses';
import { trentCourses as m_trent_university } from './trent-courses';
import { tcdCourses as m_trinity_college_dublin } from './tcd-courses';
import { tudresdenCourses as m_tu_dresden } from './tudresden-courses';
import { tuEindhovenCourses as m_tu_eindhoven } from './tu-eindhoven-courses';
import { tuftsCourses as m_tufts_university } from './tufts-courses';
import { uaeUniversityCourses as m_uae_university } from './uae-university-courses';
import { ucbCourses as m_uc_berkeley } from './ucb-courses';
import { ucdavisCourses as m_uc_davis } from './ucdavis-courses';
import { ucsdCourses as m_uc_san_diego } from './ucsd-courses';
import { ucsbCourses as m_uc_santa_barbara } from './ucsb-courses';
import { uclaCourses as m_ucla } from './ucla-courses';
import { ucnUniversityCollegeCourses as m_ucn_university_college } from './ucn-university-college-courses';
import { uiucCourses as m_uiuc_illinois } from './uiuc-courses';
import { umassAmherstCourses as m_umass_amherst } from './umass-courses';
import { umeaUniversityCourses as m_umea_university } from './umea-university-courses';
import { uncchCourses as m_unc_chapel_hill } from './uncch-courses';
import { uaeuniversityCourses as m_united_arab_emirates_university } from './uae-university-courses';
import { universitaCattolicaCourses as m_universita_cattolica } from './universita-cattolica-courses';
import { umonctonCourses as m_universite_de_moncton } from './umoncton-courses';
import { ucwCourses as m_university_canada_west } from './ucw-courses';
import { uccCourses as m_university_college_cork } from './ucc-courses';
import { ucdCourses as m_university_college_dublin } from './ucd-courses';
import { uclCourses as m_university_college_london } from './ucl-courses';
import { abdnCourses as m_university_of_aberdeen } from './abdn-courses';
import { adelaideCourses as m_university_of_adelaide } from './adelaide-courses';
import { ualbertaCourses as m_university_of_alberta } from './ualberta-courses';
import { universityOfAmsterdamCourses as m_university_of_amsterdam } from './university-of-amsterdam-courses';
import { uarizonaCourses as m_university_of_arizona } from './uarizona-courses';
import { aucklandCourses as m_university_of_auckland } from './auckland-courses';
import { universityOfBarcelonaCourses as m_university_of_barcelona } from './university-of-barcelona-courses';
import { bathCourses as m_university_of_bath } from './bath-courses';
import { bedsCourses as m_university_of_bedfordshire } from './beds-courses';
import { birminghamCourses as m_university_of_birmingham } from './birmingham-courses';
import { universityOfBolognaCourses as m_university_of_bologna } from './university-of-bologna-courses';
import { ubonnCourses as m_university_of_bonn } from './ubonn-courses';
import { universityOfBordeauxCourses as m_university_of_bordeaux } from './university-of-bordeaux-courses';
import { bradfordCourses as m_university_of_bradford } from './bradford-courses';
import { bridgeportCourses as m_university_of_bridgeport } from './bridgeport-courses';
import { brightonCourses as m_university_of_brighton } from './brighton-courses';
import { bristolCourses as m_university_of_bristol } from './bristol-courses';
import { ubcCourses as m_university_of_british_columbia } from './ubc-courses';
import { ucalgaryCourses as m_university_of_calgary } from './ucalgary-courses';
import { ucCourses as m_university_of_canberra } from './uc-courses';
import { uocCourses as m_university_of_canterbury } from './uoc-courses';
import { uclanCourses as m_university_of_central_lancashire } from './uclan-courses';
import { chesterCourses as m_university_of_chester } from './chester-courses';
import { ucincinnatiCourses as m_university_of_cincinnati } from './ucincinnati-courses';
import { ucologneCourses as m_university_of_cologne } from './ucologne-courses';
import { cuboulderCourses as m_university_of_colorado_boulder } from './cuboulder-courses';
import { uconnCourses as m_university_of_connecticut } from './uconn-courses';
import { universityOfCopenhagenCourses as m_university_of_copenhagen } from './university-of-copenhagen-courses';
import { udaytonCourses as m_university_of_dayton } from './udayton-courses';
import { udelCourses as m_university_of_delaware } from './udel-courses';
import { derbyCourses as m_university_of_derby } from './derby-courses';
import { dundeeCourses as m_university_of_dundee } from './dundee-courses';
import { ueaCourses as m_university_of_east_anglia } from './uea-courses';
import { uelCourses as m_university_of_east_london } from './uel-courses';
import { edinburghCourses as m_university_of_edinburgh } from './edinburgh-courses';
import { essexCourses as m_university_of_essex } from './essex-courses';
import { exeterCourses as m_university_of_exeter } from './exeter-courses';
import { universityOfFlorenceCourses as m_university_of_florence } from './university-of-florence-courses';
import { ufCourses as m_university_of_florida } from './uf-courses';
import { nuigCourses as m_university_of_galway } from './nuig-courses';
import { glasgowCourses as m_university_of_glasgow } from './glasgow-courses';
import { glosCourses as m_university_of_gloucestershire } from './glos-courses';
import { universityOfGothenburgCourses as m_university_of_gothenburg } from './university-of-gothenburg-courses';
import { universityOfGranadaCourses as m_university_of_granada } from './university-of-granada-courses';
import { greenwichCourses as m_university_of_greenwich } from './greenwich-courses';
import { universityOfGrenobleAlpesCourses as m_university_of_grenoble_alpes } from './university-of-grenoble-alpes-courses';
import { universityOfGroningenCourses as m_university_of_groningen } from './university-of-groningen-courses';
import { uguelphCourses as m_university_of_guelph } from './uguelph-courses';
import { uhamCourses as m_university_of_hamburg } from './uham-courses';
import { universityOfHelsinkiCourses as m_university_of_helsinki } from './university-of-helsinki-courses';
import { hertfordshireCourses as m_university_of_hertfordshire } from './hertfordshire-courses';
import { huddsCourses as m_university_of_huddersfield } from './hudds-courses';
import { kentCourses as m_university_of_kent } from './kent-courses';
import { leedsCourses as m_university_of_leeds } from './leeds-courses';
import { leicesterCourses as m_university_of_leicester } from './leicester-courses';
import { u_lethbridgeCourses as m_university_of_lethbridge } from './u-lethbridge-courses';
import { ulCourses as m_university_of_limerick } from './ul-courses';
import { lincolnCourses as m_university_of_lincoln } from './lincoln-courses';
import { universityOfLyonCourses as m_university_of_lyon } from './university-of-lyon-courses';
import { manchesterCourses as m_university_of_manchester } from './manchester-courses';
import { umanitobaCourses as m_university_of_manitoba } from './umanitoba-courses';
import { mannheimCourses as m_university_of_mannheim } from './mannheim-courses';
import { umdCourses as m_university_of_maryland } from './umd-courses';
import { uomCourses as m_university_of_melbourne } from './uom-courses';
import { umichCourses as m_university_of_michigan } from './umich-courses';
import { universityOfMilanCourses as m_university_of_milan } from './university-of-milan-courses';
import { umnCourses as m_university_of_minnesota } from './umn-courses';
import { universityOfMontpellierCourses as m_university_of_montpellier } from './university-of-montpellier-courses';
import { universityOfNaplesCourses as m_university_of_naples } from './university-of-naples-courses';
import { universityOfNavarraCourses as m_university_of_navarra } from './university-of-navarra-courses';
import { unbCourses as m_university_of_new_brunswick } from './unb-courses';
import { uneCourses as m_university_of_new_england_australia } from './une-courses';
import { unswCourses as m_university_of_new_south_wales } from './unsw-courses';
import { uonCourses as m_university_of_newcastle_australia } from './uon-courses';
import { northamptonCourses as m_university_of_northampton } from './northampton-courses';
import { unbcCourses as m_university_of_northern_bc } from './unbc-courses';
import { nottmCourses as m_university_of_nottingham } from './nottm-courses';
import { otagoCourses as m_university_of_otago } from './otago-courses';
import { uottawaCourses as m_university_of_ottawa } from './uottawa-courses';
import { universityOfPaduaCourses as m_university_of_padua } from './university-of-padua-courses';
import { universityOfParisSaclayCourses as m_university_of_paris_saclay } from './university-of-paris-saclay-courses';
import { upennCourses as m_university_of_pennsylvania } from './upenn-courses';
import { universityOfPisaCourses as m_university_of_pisa } from './university-of-pisa-courses';
import { pittCourses as m_university_of_pittsburgh } from './pitt-courses';
import { plymouthCourses as m_university_of_plymouth } from './plymouth-courses';
import { portsmouthCourses as m_university_of_portsmouth } from './portsmouth-courses';
import { uqCourses as m_university_of_queensland } from './uq-courses';
import { rdgCourses as m_university_of_reading } from './rdg-courses';
import { urCourses as m_university_of_regina } from './ur-courses';
import { urochesterCourses as m_university_of_rochester } from './urochester-courses';
import { roehamCourses as m_university_of_roehampton } from './roeham-courses';
import { universityOfSalamancaCourses as m_university_of_salamanca } from './university-of-salamanca-courses';
import { salfordCourses as m_university_of_salford } from './salford-courses';
import { usaskCourses as m_university_of_saskatchewan } from './usask-courses';
import { universityOfSevilleCourses as m_university_of_seville } from './university-of-seville-courses';
import { universityOfSharjahCourses as m_university_of_sharjah } from './university-of-sharjah-courses';
import { sheffieldCourses as m_university_of_sheffield } from './sheffield-courses';
import { unisaCourses as m_university_of_south_australia } from './unisa-courses';
import { uswCourses as m_university_of_south_wales } from './usw-courses';
import { sotonCourses as m_university_of_southampton } from './soton-courses';
import { usclaCourses as m_university_of_southern_california } from './uscla-courses';
import { universityOfSouthernDenmarkCourses as m_university_of_southern_denmark } from './university-of-southern-denmark-courses';
import { usqCourses as m_university_of_southern_queensland } from './usq-courses';
import { stirlingCourses as m_university_of_stirling } from './stirling-courses';
import { universityOfStrasbourgCourses as m_university_of_strasbourg } from './university-of-strasbourg-courses';
import { strathCourses as m_university_of_strathclyde } from './strath-courses';
import { ustuttgartCourses as m_university_of_stuttgart } from './ustuttgart-courses';
import { suffolkCourses as m_university_of_suffolk } from './suffolk-courses';
import { sunderlandCourses as m_university_of_sunderland } from './sunderland-courses';
import { uscCourses as m_university_of_sunshine_coast } from './usc-courses';
import { surreyCourses as m_university_of_surrey } from './surrey-courses';
import { sussexCourses as m_university_of_sussex } from './sussex-courses';
import { usydCourses as m_university_of_sydney } from './usyd-courses';
import { utasCourses as m_university_of_tasmania } from './utas-courses';
import { ualCourses as m_university_of_the_arts_london } from './ual-courses';
import { uoftCourses as m_university_of_toronto } from './uoft-courses';
import { universityOfToulouseCourses as m_university_of_toulouse } from './university-of-toulouse-courses';
import { universityOfTrentoCourses as m_university_of_trento } from './university-of-trento-courses';
import { universityOfTurinCourses as m_university_of_turin } from './university-of-turin-courses';
import { universityOfTwenteCourses as m_university_of_twente } from './university-of-twente-courses';
import { uutahCourses as m_university_of_utah } from './uutah-courses';
import { universityOfValenciaCourses as m_university_of_valencia } from './university-of-valencia-courses';
import { uvicCourses as m_university_of_victoria } from './uvic-courses';
import { waikatoCourses as m_university_of_waikato } from './waikato-courses';
import { warwickCourses as m_university_of_warwick } from './warwick-courses';
import { uwCourses as m_university_of_washington } from './uw-courses';
import { waterlooCourses as m_university_of_waterloo } from './waterloo-courses';
import { westlondonCourses as m_university_of_west_london } from './westlondon-courses';
import { uweCourses as m_university_of_west_of_england } from './uwe-courses';
import { uwaCourses as m_university_of_western_australia } from './uwa-courses';
import { windsorCourses as m_university_of_windsor } from './windsor-courses';
import { uwinnipegCourses as m_university_of_winnipeg } from './uwinnipeg-courses';
import { uwmadisonCourses as m_university_of_wisconsin_madison } from './uwmadison-courses';
import { uowCourses as m_university_of_wollongong } from './uow-courses';
import { wolvesCourses as m_university_of_wolverhampton } from './wolves-courses';
import { worcsCourses as m_university_of_worcester } from './worcs-courses';
import { yorkuniCourses as m_university_of_york } from './yorkuni-courses';
import { unswCourses as m_unsw_sydney } from './unsw-courses';
import { uowdDubaiCourses as m_uowd_dubai } from './uowd-dubai-courses';
import { upeiCourses as m_upei } from './upei-courses';
import { uppsalaUniversityCourses as m_uppsala_university } from './uppsala-university-courses';
import { utaustinCourses as m_ut_austin } from './utaustin-courses';
import { utrechtUniversityCourses as m_utrecht_university } from './utrecht-university-courses';
import { utsCourses as m_uts_sydney } from './uts-courses';
import { vccCourses as m_vancouver_community_college } from './vcc-courses';
import { viuCourses as m_vancouver_island_university } from './viu-courses';
import { vanderbiltCourses as m_vanderbilt_university } from './vanderbilt-courses';
import { viaUniversityCollegeCourses as m_via_university_college } from './via-university-college-courses';
import { victoriaCourses as m_victoria_university_of_wellington } from './victoria-courses';
import { vu_sydneyCourses as m_victoria_university_sydney } from './vu-sydney-courses';
import { vuwCourses as m_victoria_university_wellington } from './vuw-courses';
import { vtechCourses as m_virginia_tech } from './vtech-courses';
import { vrijeUniversiteitAmsterdamCourses as m_vrije_universiteit_amsterdam } from './vrije-universiteit-amsterdam-courses';
import { wageningenUniversityCourses as m_wageningen_university } from './wageningen-university-courses';
import { websterCourses as m_webster_university } from './webster-courses';
import { wsuCourses as m_western_sydney_university } from './wsu-courses';
import { westernCourses as m_western_university } from './western-courses';
import { laurierCourses as m_wilfrid_laurier_university } from './laurier-courses';
import { wpiCourses as m_wpi } from './wpi-courses';
import { yaleCourses as m_yale_university } from './yale-courses';
import { yorkCourses as m_york_university } from './york-courses';
import { zealandBusinessTechnologyCourses as m_zealand_business_technology } from './zealand-business-technology-courses';

const REGISTRY: Record<string, readonly unknown[]> = {
  'aalborg-university': m_aalborg_university,
  'aarhus-university': m_aarhus_university,
  'acadia-university': m_acadia_university,
  'aix-marseille-university': m_aix_marseille_university,
  'algonquin-college': m_algonquin_college,
  'american-university': m_american_university,
  'american-university-dubai': m_american_university_dubai,
  'american-university-of-sharjah': m_american_university_of_sharjah,
  'amity-university-dubai': m_amity_university_dubai,
  'amsterdam-university-of-applied-sciences': m_amsterdam_university_of_applied_sciences,
  'anglia-ruskin-university': m_anglia_ruskin_university,
  'arizona-state-university': m_arizona_state_university,
  'assiniboine-college': m_assiniboine_college,
  'aston-university': m_aston_university,
  'atlantic-technological-university': m_atlantic_technological_university,
  'auckland-university-of-technology': m_auckland_university_of_technology,
  'australian-catholic-university': m_australian_catholic_university,
  'australian-national-university': m_australian_national_university,
  'autonomous-university-of-barcelona': m_autonomous_university_of_barcelona,
  'autonomous-university-of-madrid': m_autonomous_university_of_madrid,
  'bangor-university': m_bangor_university,
  'birmingham-city-university': m_birmingham_city_university,
  'bits-pilani-dubai': m_bits_pilani_dubai,
  'bocconi-university': m_bocconi_university,
  'bond-university': m_bond_university,
  'boston-university': m_boston_university,
  'bournemouth-university': m_bournemouth_university,
  'bow-valley-college': m_bow_valley_college,
  'brandon-university': m_brandon_university,
  'brock-university': m_brock_university,
  'brown-university': m_brown_university,
  'brunel-university-london': m_brunel_university_london,
  'business-academy-aarhus': m_business_academy_aarhus,
  'ca-foscari-university-venice': m_ca_foscari_university_venice,
  'caltech': m_caltech,
  'cambrian-college': m_cambrian_college,
  'canadian-university-dubai': m_canadian_university_dubai,
  'canadore-college': m_canadore_college,
  'cape-breton-university': m_cape_breton_university,
  'capilano-university': m_capilano_university,
  'cardiff-university': m_cardiff_university,
  'carleton-university': m_carleton_university,
  'carlos-iii-university-madrid': m_carlos_iii_university_madrid,
  'carnegie-mellon-university': m_carnegie_mellon_university,
  'case-western-reserve-university': m_case_western_reserve_university,
  'centennial-college': m_centennial_college,
  'chalmers-university': m_chalmers_university,
  'charles-darwin-university': m_charles_darwin_university,
  'city-university-london': m_city_university_london,
  'clark-university': m_clark_university,
  'college-boreal': m_college_boreal,
  'college-of-the-rockies': m_college_of_the_rockies,
  'colorado-state-university': m_colorado_state_university,
  'columbia-college': m_columbia_college,
  'columbia-university': m_columbia_university,
  'complutense-university-madrid': m_complutense_university_madrid,
  'concordia-university': m_concordia_university,
  'concordia-university-edmonton': m_concordia_university_edmonton,
  'conestoga-college': m_conestoga_college,
  'confederation-college': m_confederation_college,
  'copenhagen-business-school': m_copenhagen_business_school,
  'cornell-university': m_cornell_university,
  'coventry-university': m_coventry_university,
  'cquniversity': m_cquniversity,
  'curtin-singapore': m_curtin_singapore,
  'curtin-university': m_curtin_university,
  'dalhousie-university': m_dalhousie_university,
  'dania-academy': m_dania_academy,
  'dartmouth-college': m_dartmouth_college,
  'de-montfort-university': m_de_montfort_university,
  'deakin-university': m_deakin_university,
  'delft-university-of-technology': m_delft_university_of_technology,
  'depaul-university': m_depaul_university,
  'douglas-college': m_douglas_college,
  'drexel-university': m_drexel_university,
  'dublin-business-school': m_dublin_business_school,
  'dublin-city-university': m_dublin_city_university,
  'duke-university': m_duke_university,
  'durham-college': m_durham_college,
  'durham-university': m_durham_university,
  'ea-business-academy': m_ea_business_academy,
  'eae-business-school': m_eae_business_school,
  'ecole-polytechnique': m_ecole_polytechnique,
  'edith-cowan-university': m_edith_cowan_university,
  'eindhoven-university-of-technology': m_eindhoven_university_of_technology,
  'embry-riddle-singapore': m_embry_riddle_singapore,
  'emlyon-business-school': m_emlyon_business_school,
  'emory-university': m_emory_university,
  'erasmus-university-rotterdam': m_erasmus_university_rotterdam,
  'esade-business-school': m_esade_business_school,
  'essec-business-school': m_essec_business_school,
  'fairleigh-dickinson-university': m_fairleigh_dickinson_university,
  'fairleigh-dickinson-university-vancouver': m_fairleigh_dickinson_university_vancouver,
  'fanshawe-college': m_fanshawe_college,
  'federation-university': m_federation_university,
  'first-nations-university': m_first_nations_university,
  'fleming-college': m_fleming_college,
  'flinders-university': m_flinders_university,
  'fordham-university': m_fordham_university,
  'free-university-berlin': m_free_university_berlin,
  'free-university-of-berlin': m_free_university_of_berlin,
  'george-brown-college': m_george_brown_college,
  'george-washington-university': m_george_washington_university,
  'georgetown-university': m_georgetown_university,
  'georgia-institute-of-technology': m_georgia_institute_of_technology,
  'georgia-tech': m_georgia_tech,
  'georgian-college': m_georgian_college,
  'goethe-university-frankfurt': m_goethe_university_frankfurt,
  'goldsmiths-university-london': m_goldsmiths_university_london,
  'grande-prairie-regional-college': m_grande_prairie_regional_college,
  'griffith-college-dublin': m_griffith_college_dublin,
  'griffith-university': m_griffith_university,
  'halmstad-university': m_halmstad_university,
  'han-university': m_han_university,
  'harvard-university': m_harvard_university,
  'heidelberg-university': m_heidelberg_university,
  'heriot-watt-university': m_heriot_watt_university,
  'heriot-watt-university-dubai': m_heriot_watt_university_dubai,
  'holland-college': m_holland_college,
  'holmes-institute': m_holmes_institute,
  'humber-college': m_humber_college,
  'humboldt-university-berlin': m_humboldt_university_berlin,
  'humboldt-university-of-berlin': m_humboldt_university_of_berlin,
  'iba-kolding': m_iba_kolding,
  'ie-university': m_ie_university,
  'iese-business-school': m_iese_business_school,
  'illinois-tech': m_illinois_tech,
  'indiana-university': m_indiana_university,
  'insead': m_insead,
  'iowa-state-university': m_iowa_state_university,
  'it-university-of-copenhagen': m_it_university_of_copenhagen,
  'james-cook-university-singapore': m_james_cook_university_singapore,
  'jcu-brisbane': m_jcu_brisbane,
  'johns-hopkins-university': m_johns_hopkins_university,
  'jonkoping-university': m_jonkoping_university,
  'justice-institute-of-bc': m_justice_institute_of_bc,
  'kaplan-business-school': m_kaplan_business_school,
  'kaplan-singapore': m_kaplan_singapore,
  'karlsruhe-institute-of-technology': m_karlsruhe_institute_of_technology,
  'karolinska-institutet': m_karolinska_institutet,
  'khalifa-university': m_khalifa_university,
  'kings-college-london': m_kings_college_london,
  'kingston-university-london': m_kingston_university_london,
  'kth-royal-institute-of-technology': m_kth_royal_institute_of_technology,
  'kwantlen-polytechnic-university': m_kwantlen_polytechnic_university,
  'la-cite-college': m_la_cite_college,
  'la-trobe-university': m_la_trobe_university,
  'lakehead-university': m_lakehead_university,
  'lakeland-college': m_lakeland_college,
  'lambton-college': m_lambton_college,
  'lancaster-university': m_lancaster_university,
  'langara-college': m_langara_college,
  'laurentian-university': m_laurentian_university,
  'leeds-beckett-university': m_leeds_beckett_university,
  'leiden-university': m_leiden_university,
  'lincoln-university-new-zealand': m_lincoln_university_new_zealand,
  'linkoping-university': m_linkoping_university,
  'liverpool-john-moores-university': m_liverpool_john_moores_university,
  'lmu-munich': m_lmu_munich,
  'london-metropolitan-university': m_london_metropolitan_university,
  'london-school-of-economics': m_london_school_of_economics,
  'london-south-bank-university': m_london_south_bank_university,
  'loughborough-university': m_loughborough_university,
  'loyalist-college': m_loyalist_college,
  'luiss-university': m_luiss_university,
  'lund-university': m_lund_university,
  'maastricht-university': m_maastricht_university,
  'macewan-university': m_macewan_university,
  'macquarie-university': m_macquarie_university,
  'malardalen-university': m_malardalen_university,
  'manchester-metropolitan-university': m_manchester_metropolitan_university,
  'manipal-dubai': m_manipal_dubai,
  'massey-university': m_massey_university,
  'maynooth-university': m_maynooth_university,
  'mcgill-university': m_mcgill_university,
  'mcmaster-university': m_mcmaster_university,
  'mdis-singapore': m_mdis_singapore,
  'medicine-hat-college': m_medicine_hat_college,
  'memorial-university': m_memorial_university,
  'michigan-state-university': m_michigan_state_university,
  'mid-sweden-university': m_mid_sweden_university,
  'middlesex-university': m_middlesex_university,
  'middlesex-university-dubai': m_middlesex_university_dubai,
  'mit-massachusetts': m_mit_massachusetts,
  'mohawk-college': m_mohawk_college,
  'monash-university': m_monash_university,
  'mount-allison-university': m_mount_allison_university,
  'mount-royal-university': m_mount_royal_university,
  'munster-technological-university': m_munster_technological_university,
  'murdoch-university': m_murdoch_university,
  'murdoch-university-dubai': m_murdoch_university_dubai,
  'murdoch-university-singapore': m_murdoch_university_singapore,
  'nanyang-technological-university': m_nanyang_technological_university,
  'national-college-of-ireland': m_national_college_of_ireland,
  'national-university-of-singapore': m_national_university_of_singapore,
  'navitas-australia': m_navitas_australia,
  'nbcc': m_nbcc,
  'nc-state-university': m_nc_state_university,
  'new-york-university': m_new_york_university,
  'newcastle-university': m_newcastle_university,
  'niagara-college': m_niagara_college,
  'niagara-university': m_niagara_university,
  'norquest-college': m_norquest_college,
  'north-island-college': m_north_island_college,
  'northeastern-university': m_northeastern_university,
  'northern-college': m_northern_college,
  'northumbria-university': m_northumbria_university,
  'northwestern-university': m_northwestern_university,
  'notre-dame-university': m_notre_dame_university,
  'nottingham-trent-university': m_nottingham_trent_university,
  'nscc': m_nscc,
  'nyit-vancouver': m_nyit_vancouver,
  'ohio-state-university': m_ohio_state_university,
  'okanagan-college': m_okanagan_college,
  'olds-college': m_olds_college,
  'ontario-tech-university': m_ontario_tech_university,
  'oxford-brookes-university': m_oxford_brookes_university,
  'pace-university': m_pace_university,
  'penn-state-university': m_penn_state_university,
  'politecnico-di-milano': m_politecnico_di_milano,
  'politecnico-di-torino': m_politecnico_di_torino,
  'pompeu-fabra-university': m_pompeu_fabra_university,
  'portage-college': m_portage_college,
  'princeton-university': m_princeton_university,
  'psb-academy': m_psb_academy,
  'purdue-university': m_purdue_university,
  'queen-mary-university-london': m_queen_mary_university_london,
  'queens-university': m_queens_university,
  'radboud-university': m_radboud_university,
  'rcsi-university-of-medicine': m_rcsi_university_of_medicine,
  'red-deer-polytechnic': m_red_deer_polytechnic,
  'red-river-college-polytechnic': m_red_river_college_polytechnic,
  'rensselaer-polytechnic': m_rensselaer_polytechnic,
  'rice-university': m_rice_university,
  'rit-dubai': m_rit_dubai,
  'rmit-singapore': m_rmit_singapore,
  'rmit-university': m_rmit_university,
  'robert-gordon-university': m_robert_gordon_university,
  'rochester-institute-of-technology': m_rochester_institute_of_technology,
  'roskilde-university': m_roskilde_university,
  'royal-holloway-university-london': m_royal_holloway_university_london,
  'royal-roads-university': m_royal_roads_university,
  'rutgers-university': m_rutgers_university,
  'rwth-aachen-university': m_rwth_aachen_university,
  'sait': m_sait,
  'sapienza-university-rome': m_sapienza_university_rome,
  'saskatchewan-polytechnic': m_saskatchewan_polytechnic,
  'sault-college': m_sault_college,
  'sciences-po-paris': m_sciences_po_paris,
  'selkirk-college': m_selkirk_college,
  'seneca-polytechnic': m_seneca_polytechnic,
  'sheffield-hallam-university': m_sheffield_hallam_university,
  'sheridan-college': m_sheridan_college,
  'sim-singapore': m_sim_singapore,
  'simon-fraser-university': m_simon_fraser_university,
  'singapore-institute-of-technology': m_singapore_institute_of_technology,
  'singapore-management-university': m_singapore_management_university,
  'slu-sweden': m_slu_sweden,
  'sorbonne-university': m_sorbonne_university,
  'south-east-technological-university': m_south_east_technological_university,
  'southern-cross-university': m_southern_cross_university,
  'sp-jain-dubai': m_sp_jain_dubai,
  'sp-jain-singapore': m_sp_jain_singapore,
  'st-clair-college': m_st_clair_college,
  'st-lawrence-college': m_st_lawrence_college,
  'st-thomas-university': m_st_thomas_university,
  'staffordshire-university': m_staffordshire_university,
  'stanford-university': m_stanford_university,
  'stevens-institute-of-technology': m_stevens_institute_of_technology,
  'stockholm-school-of-economics': m_stockholm_school_of_economics,
  'stockholm-university': m_stockholm_university,
  'stony-brook-university': m_stony_brook_university,
  'suny-buffalo': m_suny_buffalo,
  'sutd': m_sutd,
  'swansea-university': m_swansea_university,
  'swinburne-university': m_swinburne_university,
  'technical-university-berlin': m_technical_university_berlin,
  'technical-university-of-denmark': m_technical_university_of_denmark,
  'technical-university-of-munich': m_technical_university_of_munich,
  'technological-university-dublin': m_technological_university_dublin,
  'teesside-university': m_teesside_university,
  'temple-university': m_temple_university,
  'texas-am-university': m_texas_am_university,
  'think-education-australia': m_think_education_australia,
  'thompson-rivers-university': m_thompson_rivers_university,
  'tilburg-university': m_tilburg_university,
  'toronto-metropolitan-university': m_toronto_metropolitan_university,
  'torrens-university-australia': m_torrens_university_australia,
  'trent-university': m_trent_university,
  'trinity-college-dublin': m_trinity_college_dublin,
  'tu-dresden': m_tu_dresden,
  'tu-eindhoven': m_tu_eindhoven,
  'tufts-university': m_tufts_university,
  'uae-university': m_uae_university,
  'uc-berkeley': m_uc_berkeley,
  'uc-davis': m_uc_davis,
  'uc-san-diego': m_uc_san_diego,
  'uc-santa-barbara': m_uc_santa_barbara,
  'ucla': m_ucla,
  'ucn-university-college': m_ucn_university_college,
  'uiuc-illinois': m_uiuc_illinois,
  'umass-amherst': m_umass_amherst,
  'umea-university': m_umea_university,
  'unc-chapel-hill': m_unc_chapel_hill,
  'united-arab-emirates-university': m_united_arab_emirates_university,
  'universita-cattolica': m_universita_cattolica,
  'universite-de-moncton': m_universite_de_moncton,
  'university-canada-west': m_university_canada_west,
  'university-college-cork': m_university_college_cork,
  'university-college-dublin': m_university_college_dublin,
  'university-college-london': m_university_college_london,
  'university-of-aberdeen': m_university_of_aberdeen,
  'university-of-adelaide': m_university_of_adelaide,
  'university-of-alberta': m_university_of_alberta,
  'university-of-amsterdam': m_university_of_amsterdam,
  'university-of-arizona': m_university_of_arizona,
  'university-of-auckland': m_university_of_auckland,
  'university-of-barcelona': m_university_of_barcelona,
  'university-of-bath': m_university_of_bath,
  'university-of-bedfordshire': m_university_of_bedfordshire,
  'university-of-birmingham': m_university_of_birmingham,
  'university-of-bologna': m_university_of_bologna,
  'university-of-bonn': m_university_of_bonn,
  'university-of-bordeaux': m_university_of_bordeaux,
  'university-of-bradford': m_university_of_bradford,
  'university-of-bridgeport': m_university_of_bridgeport,
  'university-of-brighton': m_university_of_brighton,
  'university-of-bristol': m_university_of_bristol,
  'university-of-british-columbia': m_university_of_british_columbia,
  'university-of-calgary': m_university_of_calgary,
  'university-of-canberra': m_university_of_canberra,
  'university-of-canterbury': m_university_of_canterbury,
  'university-of-central-lancashire': m_university_of_central_lancashire,
  'university-of-chester': m_university_of_chester,
  'university-of-cincinnati': m_university_of_cincinnati,
  'university-of-cologne': m_university_of_cologne,
  'university-of-colorado-boulder': m_university_of_colorado_boulder,
  'university-of-connecticut': m_university_of_connecticut,
  'university-of-copenhagen': m_university_of_copenhagen,
  'university-of-dayton': m_university_of_dayton,
  'university-of-delaware': m_university_of_delaware,
  'university-of-derby': m_university_of_derby,
  'university-of-dundee': m_university_of_dundee,
  'university-of-east-anglia': m_university_of_east_anglia,
  'university-of-east-london': m_university_of_east_london,
  'university-of-edinburgh': m_university_of_edinburgh,
  'university-of-essex': m_university_of_essex,
  'university-of-exeter': m_university_of_exeter,
  'university-of-florence': m_university_of_florence,
  'university-of-florida': m_university_of_florida,
  'university-of-galway': m_university_of_galway,
  'university-of-glasgow': m_university_of_glasgow,
  'university-of-gloucestershire': m_university_of_gloucestershire,
  'university-of-gothenburg': m_university_of_gothenburg,
  'university-of-granada': m_university_of_granada,
  'university-of-greenwich': m_university_of_greenwich,
  'university-of-grenoble-alpes': m_university_of_grenoble_alpes,
  'university-of-groningen': m_university_of_groningen,
  'university-of-guelph': m_university_of_guelph,
  'university-of-hamburg': m_university_of_hamburg,
  'university-of-helsinki': m_university_of_helsinki,
  'university-of-hertfordshire': m_university_of_hertfordshire,
  'university-of-huddersfield': m_university_of_huddersfield,
  'university-of-kent': m_university_of_kent,
  'university-of-leeds': m_university_of_leeds,
  'university-of-leicester': m_university_of_leicester,
  'university-of-lethbridge': m_university_of_lethbridge,
  'university-of-limerick': m_university_of_limerick,
  'university-of-lincoln': m_university_of_lincoln,
  'university-of-lyon': m_university_of_lyon,
  'university-of-manchester': m_university_of_manchester,
  'university-of-manitoba': m_university_of_manitoba,
  'university-of-mannheim': m_university_of_mannheim,
  'university-of-maryland': m_university_of_maryland,
  'university-of-melbourne': m_university_of_melbourne,
  'university-of-michigan': m_university_of_michigan,
  'university-of-milan': m_university_of_milan,
  'university-of-minnesota': m_university_of_minnesota,
  'university-of-montpellier': m_university_of_montpellier,
  'university-of-naples': m_university_of_naples,
  'university-of-navarra': m_university_of_navarra,
  'university-of-new-brunswick': m_university_of_new_brunswick,
  'university-of-new-england-australia': m_university_of_new_england_australia,
  'university-of-new-south-wales': m_university_of_new_south_wales,
  'university-of-newcastle-australia': m_university_of_newcastle_australia,
  'university-of-northampton': m_university_of_northampton,
  'university-of-northern-bc': m_university_of_northern_bc,
  'university-of-nottingham': m_university_of_nottingham,
  'university-of-otago': m_university_of_otago,
  'university-of-ottawa': m_university_of_ottawa,
  'university-of-padua': m_university_of_padua,
  'university-of-paris-saclay': m_university_of_paris_saclay,
  'university-of-pennsylvania': m_university_of_pennsylvania,
  'university-of-pisa': m_university_of_pisa,
  'university-of-pittsburgh': m_university_of_pittsburgh,
  'university-of-plymouth': m_university_of_plymouth,
  'university-of-portsmouth': m_university_of_portsmouth,
  'university-of-queensland': m_university_of_queensland,
  'university-of-reading': m_university_of_reading,
  'university-of-regina': m_university_of_regina,
  'university-of-rochester': m_university_of_rochester,
  'university-of-roehampton': m_university_of_roehampton,
  'university-of-salamanca': m_university_of_salamanca,
  'university-of-salford': m_university_of_salford,
  'university-of-saskatchewan': m_university_of_saskatchewan,
  'university-of-seville': m_university_of_seville,
  'university-of-sharjah': m_university_of_sharjah,
  'university-of-sheffield': m_university_of_sheffield,
  'university-of-south-australia': m_university_of_south_australia,
  'university-of-south-wales': m_university_of_south_wales,
  'university-of-southampton': m_university_of_southampton,
  'university-of-southern-california': m_university_of_southern_california,
  'university-of-southern-denmark': m_university_of_southern_denmark,
  'university-of-southern-queensland': m_university_of_southern_queensland,
  'university-of-stirling': m_university_of_stirling,
  'university-of-strasbourg': m_university_of_strasbourg,
  'university-of-strathclyde': m_university_of_strathclyde,
  'university-of-stuttgart': m_university_of_stuttgart,
  'university-of-suffolk': m_university_of_suffolk,
  'university-of-sunderland': m_university_of_sunderland,
  'university-of-sunshine-coast': m_university_of_sunshine_coast,
  'university-of-surrey': m_university_of_surrey,
  'university-of-sussex': m_university_of_sussex,
  'university-of-sydney': m_university_of_sydney,
  'university-of-tasmania': m_university_of_tasmania,
  'university-of-the-arts-london': m_university_of_the_arts_london,
  'university-of-toronto': m_university_of_toronto,
  'university-of-toulouse': m_university_of_toulouse,
  'university-of-trento': m_university_of_trento,
  'university-of-turin': m_university_of_turin,
  'university-of-twente': m_university_of_twente,
  'university-of-utah': m_university_of_utah,
  'university-of-valencia': m_university_of_valencia,
  'university-of-victoria': m_university_of_victoria,
  'university-of-waikato': m_university_of_waikato,
  'university-of-warwick': m_university_of_warwick,
  'university-of-washington': m_university_of_washington,
  'university-of-waterloo': m_university_of_waterloo,
  'university-of-west-london': m_university_of_west_london,
  'university-of-west-of-england': m_university_of_west_of_england,
  'university-of-western-australia': m_university_of_western_australia,
  'university-of-windsor': m_university_of_windsor,
  'university-of-winnipeg': m_university_of_winnipeg,
  'university-of-wisconsin-madison': m_university_of_wisconsin_madison,
  'university-of-wollongong': m_university_of_wollongong,
  'university-of-wolverhampton': m_university_of_wolverhampton,
  'university-of-worcester': m_university_of_worcester,
  'university-of-york': m_university_of_york,
  'unsw-sydney': m_unsw_sydney,
  'uowd-dubai': m_uowd_dubai,
  'upei': m_upei,
  'uppsala-university': m_uppsala_university,
  'ut-austin': m_ut_austin,
  'utrecht-university': m_utrecht_university,
  'uts-sydney': m_uts_sydney,
  'vancouver-community-college': m_vancouver_community_college,
  'vancouver-island-university': m_vancouver_island_university,
  'vanderbilt-university': m_vanderbilt_university,
  'via-university-college': m_via_university_college,
  'victoria-university-of-wellington': m_victoria_university_of_wellington,
  'victoria-university-sydney': m_victoria_university_sydney,
  'victoria-university-wellington': m_victoria_university_wellington,
  'virginia-tech': m_virginia_tech,
  'vrije-universiteit-amsterdam': m_vrije_universiteit_amsterdam,
  'wageningen-university': m_wageningen_university,
  'webster-university': m_webster_university,
  'western-sydney-university': m_western_sydney_university,
  'western-university': m_western_university,
  'wilfrid-laurier-university': m_wilfrid_laurier_university,
  'wpi': m_wpi,
  'yale-university': m_yale_university,
  'york-university': m_york_university,
  'zealand-business-technology': m_zealand_business_technology,
};

export interface RegistryCourse {
  name: string;
  slug: string;
  level: string;
  duration: string;
  annualUSD: number;
  annualINR: number;
  ieltsMin: number;
  intakeMonths: string[];
}

function n(c: any): RegistryCourse {
  return {
    name: c.name ?? '',
    slug: c.slug ?? '',
    level: c.studyLevel || c.level || 'Postgraduate',
    duration: c.duration ?? '1–2 years',
    annualUSD: Number(c.annualUSD) || 0,
    annualINR: Number(c.annualINR) || 0,
    ieltsMin: Number(c.ieltsMin) || 6.0,
    intakeMonths: Array.isArray(c.intakeMonths) ? c.intakeMonths : ['September'],
  };
}



/** Returns a lightweight slug→courseNames map for client-side search. */
export function getCourseIndex(): Record<string, string[]> {
  const index: Record<string, string[]> = {};
  for (const [slug, courses] of Object.entries(REGISTRY)) {
    index[slug] = (courses as any[]).map((c: any) => c.name ?? '').filter(Boolean);
  }
  return index;
}

export interface CourseSearchEntry {
  name: string;
  slug: string;
  level: string;        // 'UG' | 'PG' | 'MBA' | 'PhD'
  universitySlug: string;
}

export function classifyLevel(name: string, studyLevelRaw = '', levelRaw = ''): string {
  const n = name.toLowerCase();
  const sl = (studyLevelRaw + ' ' + levelRaw).toLowerCase();
  if (/^(phd|dphil|doctorate)/.test(n) || sl.includes('phd') || sl.includes('doctoral')) return 'PhD';
  if (/\bmba\b/.test(n) || sl.includes('mba')) return 'MBA';
  if (
    /^(bsc|beng|ba |bed |barch|bcom|bba|bhsc|bbus|bfin|blaw|bmus|bfa|bachelor|b\.sc|b\.eng)/.test(n) ||
    sl.includes('bachelor') || sl.includes('undergraduate')
  ) return 'UG';
  return 'PG';
}

let _searchCache: CourseSearchEntry[] | null = null;

/** Flat list of every course in the registry — used by the search API. */
export function getCourseSearchEntries(): CourseSearchEntry[] {
  if (_searchCache) return _searchCache;
  const entries: CourseSearchEntry[] = [];
  for (const [uniSlug, courses] of Object.entries(REGISTRY)) {
    for (const raw of courses as any[]) {
      const name: string = raw.name ?? '';
      if (!name) continue;
      entries.push({
        name,
        slug: raw.slug ?? '',
        level: classifyLevel(name, raw.studyLevel ?? '', raw.level ?? ''),
        universitySlug: uniSlug,
      });
    }
  }
  _searchCache = entries;
  return entries;
}

export function getCoursesBySlug(slug: string): RegistryCourse[] {
  const raw = REGISTRY[slug];
  if (!raw || raw.length === 0) return [];
  return (raw as any[]).map(n);
}

export function findAlternativeCourses(
  fieldKeywords: string[],
  currentUniSlug: string,
  ieltsMax: number | undefined,
  limit = 2
): Array<RegistryCourse & { universitySlug: string }> {
  if (fieldKeywords.length === 0) return [];
  const results: Array<RegistryCourse & { universitySlug: string }> = [];
  const seenUnis = new Set<string>();

  for (const [slug, courses] of Object.entries(REGISTRY)) {
    if (slug === currentUniSlug || seenUnis.has(slug)) continue;
    for (const raw of courses as any[]) {
      const c = n(raw);
      if (ieltsMax !== undefined && c.ieltsMin > ieltsMax) continue;
      const nameLower = c.name.toLowerCase();
      if (!fieldKeywords.some(kw => nameLower.includes(kw))) continue;
      seenUnis.add(slug);
      results.push({ ...c, universitySlug: slug });
      break;
    }
    if (results.length >= limit) break;
  }
  return results;
}
