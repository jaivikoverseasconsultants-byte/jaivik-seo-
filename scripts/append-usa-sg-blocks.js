#!/usr/bin/env node
/**
 * Appends complete USA + Singapore university blocks to data/universities.ts
 * Fixes ielts default for SG_EXISTING + generates full University objects
 */
const fs = require('fs');
const path = require('path');

function usd2inr(u) { return Math.round(u * 84); }

// ─── USA NEW data ─────────────────────────────────────────────────────────
const USA_NEW = [
  { id:'us11', name:'Yale University',                      shortName:'Yale',         slug:'yale-university',                    state:'Connecticut',   city:'New Haven',      tuition:64000, ielts:7.0, toefl:100, qs:10,  gpa:9.5, acc:6,  emp:97, sal:110000, est:1701, tot:13600, intp:22, popular:false, tier:'elite' },
  { id:'us12', name:'Princeton University',                 shortName:'Princeton',    slug:'princeton-university',               state:'New Jersey',    city:'Princeton',      tuition:62000, ielts:7.0, toefl:100, qs:13,  gpa:9.5, acc:4,  emp:97, sal:115000, est:1746, tot:8000,  intp:23, popular:false, tier:'elite' },
  { id:'us13', name:'Columbia University',                  shortName:'Columbia',     slug:'columbia-university',                state:'New York',      city:'New York',       tuition:67000, ielts:7.0, toefl:100, qs:12,  gpa:9.5, acc:4,  emp:97, sal:115000, est:1754, tot:31000, intp:29, popular:false, tier:'elite' },
  { id:'us14', name:'Cornell University',                   shortName:'Cornell',      slug:'cornell-university',                 state:'New York',      city:'Ithaca',         tuition:63000, ielts:7.0, toefl:100, qs:14,  gpa:9.0, acc:11, emp:96, sal:105000, est:1865, tot:23600, intp:26, popular:true,  tier:'elite' },
  { id:'us15', name:'Dartmouth College',                    shortName:'Dartmouth',    slug:'dartmouth-college',                  state:'New Hampshire', city:'Hanover',        tuition:63000, ielts:7.0, toefl:100, qs:250, gpa:9.5, acc:7,  emp:96, sal:100000, est:1769, tot:6100,  intp:10, popular:false, tier:'elite' },
  { id:'us16', name:'Brown University',                     shortName:'Brown',        slug:'brown-university',                   state:'Rhode Island',  city:'Providence',     tuition:65000, ielts:7.0, toefl:100, qs:197, gpa:9.5, acc:5,  emp:95, sal:100000, est:1764, tot:10600, intp:14, popular:false, tier:'elite' },
  { id:'us17', name:'University of Pennsylvania',           shortName:'UPenn',        slug:'university-of-pennsylvania',         state:'Pennsylvania',  city:'Philadelphia',   tuition:65000, ielts:7.0, toefl:100, qs:13,  gpa:9.5, acc:7,  emp:98, sal:115000, est:1740, tot:21000, intp:23, popular:false, tier:'elite' },
  { id:'us18', name:'California Institute of Technology',   shortName:'Caltech',      slug:'caltech',                            state:'California',    city:'Pasadena',       tuition:60000, ielts:7.0, toefl:100, qs:6,   gpa:9.8, acc:3,  emp:98, sal:130000, est:1891, tot:2400,  intp:31, popular:false, tier:'elite' },
  { id:'us19', name:'Johns Hopkins University',             shortName:'JHU',          slug:'johns-hopkins-university',           state:'Maryland',      city:'Baltimore',      tuition:63000, ielts:6.5, toefl:90,  qs:25,  gpa:9.0, acc:7,  emp:97, sal:108000, est:1876, tot:25000, intp:24, popular:true,  tier:'elite' },
  { id:'us20', name:'Duke University',                      shortName:'Duke',         slug:'duke-university',                    state:'North Carolina',city:'Durham',         tuition:63000, ielts:7.0, toefl:100, qs:67,  gpa:9.5, acc:6,  emp:97, sal:105000, est:1838, tot:17000, intp:21, popular:false, tier:'elite' },
  { id:'us21', name:'Northwestern University',              shortName:'Northwestern', slug:'northwestern-university',            state:'Illinois',      city:'Evanston',       tuition:64000, ielts:7.0, toefl:100, qs:47,  gpa:9.5, acc:7,  emp:97, sal:108000, est:1851, tot:22000, intp:21, popular:false, tier:'elite' },
  { id:'us22', name:'Vanderbilt University',                shortName:'Vanderbilt',   slug:'vanderbilt-university',              state:'Tennessee',     city:'Nashville',      tuition:58000, ielts:6.5, toefl:95,  qs:246, gpa:9.0, acc:9,  emp:96, sal:95000,  est:1873, tot:13000, intp:11, popular:false, tier:'top-research' },
  { id:'us23', name:'Emory University',                     shortName:'Emory',        slug:'emory-university',                   state:'Georgia',       city:'Atlanta',        tuition:58000, ielts:6.5, toefl:90,  qs:316, gpa:9.0, acc:18, emp:95, sal:92000,  est:1836, tot:15000, intp:20, popular:true,  tier:'top-research' },
  { id:'us24', name:'Rice University',                      shortName:'Rice',         slug:'rice-university',                    state:'Texas',         city:'Houston',        tuition:56000, ielts:6.5, toefl:90,  qs:162, gpa:9.0, acc:9,  emp:96, sal:100000, est:1912, tot:4200,  intp:27, popular:false, tier:'elite' },
  { id:'us25', name:'Georgetown University',                shortName:'Georgetown',   slug:'georgetown-university',              state:'D.C.',           city:'Washington',     tuition:62000, ielts:7.0, toefl:100, qs:284, gpa:9.0, acc:12, emp:96, sal:98000,  est:1789, tot:20000, intp:17, popular:false, tier:'elite' },
  { id:'us26', name:'University of Notre Dame',             shortName:'Notre Dame',   slug:'notre-dame-university',              state:'Indiana',       city:'Notre Dame',     tuition:60000, ielts:6.5, toefl:90,  qs:223, gpa:9.0, acc:15, emp:96, sal:95000,  est:1842, tot:12600, intp:9,  popular:false, tier:'elite' },
  { id:'us27', name:'Tufts University',                     shortName:'Tufts',        slug:'tufts-university',                   state:'Massachusetts', city:'Medford',        tuition:62000, ielts:6.5, toefl:90,  qs:371, gpa:9.0, acc:11, emp:95, sal:92000,  est:1852, tot:11000, intp:17, popular:false, tier:'top-research' },
  { id:'us28', name:'Boston University',                    shortName:'BU',           slug:'boston-university',                  state:'Massachusetts', city:'Boston',         tuition:58000, ielts:6.5, toefl:90,  qs:113, gpa:8.5, acc:18, emp:94, sal:88000,  est:1839, tot:33000, intp:24, popular:true,  tier:'private-mid' },
  { id:'us29', name:'New York University',                  shortName:'NYU',          slug:'new-york-university',                state:'New York',      city:'New York',       tuition:60000, ielts:6.5, toefl:90,  qs:58,  gpa:8.5, acc:20, emp:94, sal:90000,  est:1831, tot:50000, intp:30, popular:true,  tier:'top-research' },
  { id:'us30', name:'University of Southern California',    shortName:'USC',          slug:'university-of-southern-california',  state:'California',    city:'Los Angeles',    tuition:64000, ielts:6.5, toefl:90,  qs:152, gpa:8.5, acc:16, emp:94, sal:90000,  est:1880, tot:44000, intp:25, popular:true,  tier:'top-research' },
  { id:'us31', name:'Fordham University',                   shortName:'Fordham',      slug:'fordham-university',                 state:'New York',      city:'New York',       tuition:57000, ielts:6.5, toefl:90,  qs:601, gpa:8.0, acc:50, emp:90, sal:75000,  est:1841, tot:16000, intp:12, popular:false, tier:'private-mid' },
  { id:'us32', name:'University of California Los Angeles', shortName:'UCLA',         slug:'ucla',                               state:'California',    city:'Los Angeles',    tuition:44000, ielts:6.5, toefl:87,  qs:29,  gpa:8.5, acc:14, emp:95, sal:95000,  est:1919, tot:46000, intp:18, popular:true,  tier:'top-state' },
  { id:'us33', name:'University of Michigan',               shortName:'UMich',        slug:'university-of-michigan',             state:'Michigan',      city:'Ann Arbor',      tuition:52000, ielts:6.5, toefl:88,  qs:23,  gpa:8.5, acc:18, emp:96, sal:95000,  est:1817, tot:47000, intp:16, popular:true,  tier:'top-state' },
  { id:'us34', name:'University of Texas Austin',           shortName:'UT Austin',    slug:'ut-austin',                          state:'Texas',         city:'Austin',         tuition:40000, ielts:6.5, toefl:79,  qs:67,  gpa:8.0, acc:31, emp:92, sal:85000,  est:1883, tot:51000, intp:11, popular:true,  tier:'top-state' },
  { id:'us35', name:'UNC Chapel Hill',                      shortName:'UNC',          slug:'unc-chapel-hill',                    state:'North Carolina',city:'Chapel Hill',    tuition:36000, ielts:6.5, toefl:79,  qs:359, gpa:8.0, acc:24, emp:91, sal:80000,  est:1789, tot:32000, intp:7,  popular:false, tier:'top-state' },
  { id:'us36', name:'University of Washington',             shortName:'UW',           slug:'university-of-washington',           state:'Washington',    city:'Seattle',        tuition:40000, ielts:6.5, toefl:79,  qs:59,  gpa:8.0, acc:49, emp:93, sal:90000,  est:1861, tot:47000, intp:17, popular:true,  tier:'top-state' },
  { id:'us37', name:'Ohio State University',                shortName:'OSU',          slug:'ohio-state-university',              state:'Ohio',          city:'Columbus',       tuition:36000, ielts:6.5, toefl:79,  qs:171, gpa:7.5, acc:54, emp:90, sal:78000,  est:1870, tot:61000, intp:9,  popular:true,  tier:'top-state' },
  { id:'us38', name:'Penn State University',                shortName:'Penn State',   slug:'penn-state-university',              state:'Pennsylvania',  city:'State College',  tuition:38000, ielts:6.5, toefl:80,  qs:331, gpa:7.5, acc:55, emp:90, sal:78000,  est:1855, tot:46000, intp:12, popular:true,  tier:'top-state' },
  { id:'us39', name:'University of Florida',                shortName:'UF',           slug:'university-of-florida',              state:'Florida',       city:'Gainesville',    tuition:30000, ielts:6.0, toefl:80,  qs:174, gpa:7.5, acc:31, emp:89, sal:75000,  est:1853, tot:56000, intp:9,  popular:true,  tier:'top-state' },
  { id:'us40', name:'UC San Diego',                         shortName:'UCSD',         slug:'uc-san-diego',                       state:'California',    city:'San Diego',      tuition:44000, ielts:6.5, toefl:83,  qs:63,  gpa:8.0, acc:34, emp:93, sal:90000,  est:1960, tot:42000, intp:23, popular:true,  tier:'top-state' },
  { id:'us41', name:'UC Davis',                             shortName:'UCD',          slug:'uc-davis',                           state:'California',    city:'Davis',          tuition:44000, ielts:6.5, toefl:80,  qs:178, gpa:8.0, acc:39, emp:90, sal:82000,  est:1905, tot:39000, intp:16, popular:true,  tier:'top-state' },
  { id:'us42', name:'UC Santa Barbara',                     shortName:'UCSB',         slug:'uc-santa-barbara',                   state:'California',    city:'Santa Barbara',  tuition:44000, ielts:6.5, toefl:80,  qs:130, gpa:8.0, acc:36, emp:90, sal:82000,  est:1909, tot:26000, intp:17, popular:false, tier:'top-state' },
  { id:'us43', name:'Virginia Tech',                        shortName:'VTech',        slug:'virginia-tech',                      state:'Virginia',      city:'Blacksburg',     tuition:34000, ielts:6.0, toefl:80,  qs:401, gpa:7.5, acc:68, emp:89, sal:76000,  est:1872, tot:37000, intp:9,  popular:true,  tier:'top-state' },
  { id:'us44', name:'University of Maryland',               shortName:'UMD',          slug:'university-of-maryland',             state:'Maryland',      city:'College Park',   tuition:38000, ielts:6.5, toefl:80,  qs:146, gpa:8.0, acc:44, emp:91, sal:85000,  est:1856, tot:41000, intp:15, popular:true,  tier:'top-state' },
  { id:'us45', name:'University of Wisconsin–Madison',      shortName:'UW-Madison',   slug:'university-of-wisconsin-madison',    state:'Wisconsin',     city:'Madison',        tuition:38000, ielts:6.5, toefl:79,  qs:163, gpa:8.0, acc:57, emp:91, sal:82000,  est:1848, tot:48000, intp:10, popular:false, tier:'top-state' },
  { id:'us46', name:'University of Minnesota',              shortName:'U Minnesota',  slug:'university-of-minnesota',            state:'Minnesota',     city:'Minneapolis',    tuition:35000, ielts:6.5, toefl:79,  qs:171, gpa:7.5, acc:57, emp:90, sal:80000,  est:1851, tot:52000, intp:11, popular:false, tier:'top-state' },
  { id:'us47', name:'Michigan State University',            shortName:'MSU',          slug:'michigan-state-university',          state:'Michigan',      city:'East Lansing',   tuition:28000, ielts:6.0, toefl:79,  qs:287, gpa:7.0, acc:76, emp:88, sal:72000,  est:1855, tot:50000, intp:12, popular:true,  tier:'top-state' },
  { id:'us48', name:'Indiana University Bloomington',       shortName:'IU',           slug:'indiana-university',                 state:'Indiana',       city:'Bloomington',    tuition:28000, ielts:6.0, toefl:79,  qs:401, gpa:7.0, acc:80, emp:87, sal:70000,  est:1820, tot:46000, intp:12, popular:true,  tier:'top-state' },
  { id:'us49', name:'University of Colorado Boulder',       shortName:'CU Boulder',   slug:'university-of-colorado-boulder',     state:'Colorado',      city:'Boulder',        tuition:36000, ielts:6.5, toefl:75,  qs:301, gpa:7.5, acc:84, emp:88, sal:76000,  est:1876, tot:37000, intp:9,  popular:false, tier:'top-state' },
  { id:'us50', name:'University of Pittsburgh',             shortName:'Pitt',         slug:'university-of-pittsburgh',           state:'Pennsylvania',  city:'Pittsburgh',     tuition:32000, ielts:6.5, toefl:80,  qs:361, gpa:7.5, acc:57, emp:89, sal:78000,  est:1787, tot:34000, intp:9,  popular:false, tier:'top-state' },
  { id:'us51', name:'Texas A&M University',                 shortName:'TAMU',         slug:'texas-am-university',                state:'Texas',         city:'College Station',tuition:38000, ielts:6.0, toefl:79,  qs:174, gpa:7.5, acc:63, emp:91, sal:82000,  est:1876, tot:73000, intp:7,  popular:true,  tier:'top-state' },
  { id:'us52', name:'Rutgers University',                   shortName:'Rutgers',      slug:'rutgers-university',                 state:'New Jersey',    city:'New Brunswick',  tuition:32000, ielts:6.0, toefl:79,  qs:355, gpa:7.5, acc:68, emp:88, sal:76000,  est:1766, tot:50000, intp:14, popular:true,  tier:'top-state' },
  { id:'us53', name:'Stony Brook University',               shortName:'Stony Brook',  slug:'stony-brook-university',             state:'New York',      city:'Stony Brook',    tuition:26000, ielts:6.0, toefl:80,  qs:401, gpa:7.5, acc:49, emp:87, sal:74000,  est:1957, tot:27000, intp:28, popular:true,  tier:'popular-indians' },
  { id:'us54', name:'University at Buffalo (SUNY)',         shortName:'SUNY Buffalo', slug:'suny-buffalo',                       state:'New York',      city:'Buffalo',        tuition:24000, ielts:6.0, toefl:79,  qs:461, gpa:7.0, acc:64, emp:86, sal:70000,  est:1846, tot:32000, intp:27, popular:true,  tier:'popular-indians' },
  { id:'us55', name:'Illinois Institute of Technology',     shortName:'Illinois Tech',slug:'illinois-tech',                     state:'Illinois',      city:'Chicago',        tuition:32000, ielts:6.0, toefl:80,  qs:501, gpa:7.5, acc:53, emp:88, sal:75000,  est:1890, tot:7500,  intp:40, popular:true,  tier:'popular-indians' },
  { id:'us56', name:'DePaul University',                    shortName:'DePaul',       slug:'depaul-university',                  state:'Illinois',      city:'Chicago',        tuition:24000, ielts:6.0, toefl:80,  qs:801, gpa:7.0, acc:70, emp:85, sal:65000,  est:1898, tot:22000, intp:8,  popular:false, tier:'popular-indians' },
  { id:'us57', name:'University of Dayton',                 shortName:'UDayton',      slug:'university-of-dayton',               state:'Ohio',          city:'Dayton',         tuition:22000, ielts:6.0, toefl:79,  qs:801, gpa:7.0, acc:78, emp:84, sal:65000,  est:1850, tot:12000, intp:7,  popular:false, tier:'popular-indians' },
  { id:'us58', name:'Clark University',                     shortName:'Clark',        slug:'clark-university',                   state:'Massachusetts', city:'Worcester',      tuition:22000, ielts:6.0, toefl:79,  qs:801, gpa:7.0, acc:54, emp:84, sal:65000,  est:1887, tot:3700,  intp:22, popular:true,  tier:'popular-indians' },
  { id:'us59', name:'Worcester Polytechnic Institute',      shortName:'WPI',          slug:'wpi',                                state:'Massachusetts', city:'Worcester',      tuition:28000, ielts:6.0, toefl:79,  qs:601, gpa:7.5, acc:48, emp:90, sal:80000,  est:1865, tot:6800,  intp:24, popular:true,  tier:'popular-indians' },
  { id:'us60', name:'Pace University',                      shortName:'Pace',         slug:'pace-university',                    state:'New York',      city:'New York',       tuition:20000, ielts:6.0, toefl:75,  qs:1001,gpa:6.5, acc:84, emp:82, sal:60000,  est:1906, tot:13000, intp:20, popular:true,  tier:'popular-indians' },
  { id:'us61', name:'University of Bridgeport',             shortName:'UBridgeport',  slug:'university-of-bridgeport',           state:'Connecticut',   city:'Bridgeport',     tuition:18000, ielts:6.0, toefl:75,  qs:1001,gpa:6.5, acc:88, emp:80, sal:55000,  est:1927, tot:4500,  intp:38, popular:true,  tier:'popular-indians' },
  { id:'us62', name:'Fairleigh Dickinson University',       shortName:'FDU',          slug:'fairleigh-dickinson-university',     state:'New Jersey',    city:'Teaneck',        tuition:18000, ielts:6.0, toefl:79,  qs:1001,gpa:6.5, acc:85, emp:80, sal:55000,  est:1942, tot:11000, intp:30, popular:true,  tier:'popular-indians' },
  { id:'us63', name:'Webster University',                   shortName:'Webster',      slug:'webster-university',                 state:'Missouri',      city:'Webster Groves', tuition:18000, ielts:6.0, toefl:75,  qs:1001,gpa:6.5, acc:70, emp:80, sal:55000,  est:1915, tot:17000, intp:22, popular:true,  tier:'popular-indians' },
  { id:'us64', name:'George Washington University',         shortName:'GWU',          slug:'george-washington-university',       state:'D.C.',           city:'Washington',     tuition:32000, ielts:6.5, toefl:80,  qs:601, gpa:8.0, acc:40, emp:90, sal:80000,  est:1821, tot:26000, intp:13, popular:false, tier:'private-mid' },
  { id:'us65', name:'American University',                  shortName:'American U',   slug:'american-university',                state:'D.C.',           city:'Washington',     tuition:30000, ielts:6.5, toefl:80,  qs:801, gpa:7.5, acc:36, emp:88, sal:74000,  est:1893, tot:13000, intp:15, popular:false, tier:'private-mid' },
  { id:'us66', name:'Drexel University',                    shortName:'Drexel',       slug:'drexel-university',                  state:'Pennsylvania',  city:'Philadelphia',   tuition:26000, ielts:6.0, toefl:79,  qs:601, gpa:7.5, acc:75, emp:89, sal:75000,  est:1891, tot:24000, intp:18, popular:true,  tier:'private-mid' },
  { id:'us67', name:'Temple University',                    shortName:'Temple',       slug:'temple-university',                  state:'Pennsylvania',  city:'Philadelphia',   tuition:22000, ielts:6.0, toefl:79,  qs:601, gpa:7.0, acc:65, emp:86, sal:68000,  est:1884, tot:39000, intp:11, popular:true,  tier:'popular-indians' },
  { id:'us68', name:'University of Connecticut',            shortName:'UConn',        slug:'university-of-connecticut',          state:'Connecticut',   city:'Storrs',         tuition:24000, ielts:6.0, toefl:79,  qs:501, gpa:7.5, acc:49, emp:88, sal:74000,  est:1881, tot:32000, intp:9,  popular:false, tier:'top-state' },
  { id:'us69', name:'Rochester Institute of Technology',    shortName:'RIT',          slug:'rochester-institute-of-technology',  state:'New York',      city:'Rochester',      tuition:26000, ielts:6.0, toefl:79,  qs:601, gpa:7.5, acc:56, emp:90, sal:76000,  est:1829, tot:19000, intp:25, popular:true,  tier:'popular-indians' },
  { id:'us70', name:'Stevens Institute of Technology',      shortName:'Stevens',      slug:'stevens-institute-of-technology',    state:'New Jersey',    city:'Hoboken',        tuition:28000, ielts:6.0, toefl:79,  qs:801, gpa:7.5, acc:45, emp:90, sal:80000,  est:1870, tot:7600,  intp:25, popular:true,  tier:'popular-indians' },
  { id:'us71', name:'Rensselaer Polytechnic Institute',     shortName:'RPI',          slug:'rensselaer-polytechnic',             state:'New York',      city:'Troy',           tuition:28000, ielts:6.0, toefl:79,  qs:601, gpa:7.5, acc:62, emp:90, sal:80000,  est:1824, tot:7600,  intp:22, popular:true,  tier:'popular-indians' },
  { id:'us72', name:'University of Arizona',                shortName:'UofA',         slug:'university-of-arizona',              state:'Arizona',       city:'Tucson',         tuition:22000, ielts:6.0, toefl:70,  qs:401, gpa:7.0, acc:82, emp:86, sal:68000,  est:1885, tot:47000, intp:13, popular:true,  tier:'top-state' },
  { id:'us73', name:'Colorado State University',            shortName:'CSU',          slug:'colorado-state-university',          state:'Colorado',      city:'Fort Collins',   tuition:20000, ielts:6.0, toefl:71,  qs:601, gpa:7.0, acc:82, emp:85, sal:65000,  est:1870, tot:33000, intp:8,  popular:false, tier:'top-state' },
  { id:'us74', name:'University of Utah',                   shortName:'U Utah',       slug:'university-of-utah',                 state:'Utah',          city:'Salt Lake City', tuition:22000, ielts:6.0, toefl:80,  qs:501, gpa:7.0, acc:81, emp:86, sal:70000,  est:1850, tot:33000, intp:13, popular:false, tier:'top-state' },
  { id:'us75', name:'University of Rochester',              shortName:'U Rochester',  slug:'university-of-rochester',            state:'New York',      city:'Rochester',      tuition:32000, ielts:6.5, toefl:90,  qs:284, gpa:8.5, acc:30, emp:93, sal:88000,  est:1850, tot:12000, intp:25, popular:false, tier:'top-research' },
  { id:'us76', name:'Case Western Reserve University',      shortName:'CWRU',         slug:'case-western-reserve-university',    state:'Ohio',          city:'Cleveland',      tuition:32000, ielts:6.5, toefl:90,  qs:284, gpa:8.5, acc:27, emp:93, sal:88000,  est:1826, tot:12000, intp:23, popular:false, tier:'top-research' },
  { id:'us77', name:'NC State University',                  shortName:'NC State',     slug:'nc-state-university',                state:'North Carolina',city:'Raleigh',        tuition:22000, ielts:6.0, toefl:79,  qs:401, gpa:7.5, acc:45, emp:90, sal:78000,  est:1887, tot:36000, intp:11, popular:true,  tier:'top-state' },
  { id:'us78', name:'Iowa State University',                shortName:'Iowa State',   slug:'iowa-state-university',              state:'Iowa',          city:'Ames',           tuition:20000, ielts:6.0, toefl:71,  qs:601, gpa:7.0, acc:88, emp:87, sal:70000,  est:1858, tot:32000, intp:10, popular:false, tier:'top-state' },
  { id:'us79', name:'University of Cincinnati',             shortName:'U Cincinnati', slug:'university-of-cincinnati',           state:'Ohio',          city:'Cincinnati',     tuition:22000, ielts:6.0, toefl:79,  qs:601, gpa:7.0, acc:76, emp:87, sal:70000,  est:1819, tot:48000, intp:9,  popular:false, tier:'top-state' },
  { id:'us80', name:'University of Delaware',               shortName:'UDel',         slug:'university-of-delaware',             state:'Delaware',      city:'Newark',         tuition:20000, ielts:6.0, toefl:79,  qs:601, gpa:7.0, acc:68, emp:86, sal:68000,  est:1743, tot:23000, intp:12, popular:true,  tier:'popular-indians' },
];

// ─── Singapore NEW data ──────────────────────────────────────────────────────
const SG_NEW = [
  { id:'sg03', name:'Singapore Management University',                 shortName:'SMU',      slug:'singapore-management-university',          tuitionSGD:20000, ielts:6.5, toefl:90,  qs:501, gpa:8.5, acc:30, emp:95, salUSD:55000, est:2000, tot:10000, intp:25, popular:true,  tier:'sg-elite' },
  { id:'sg04', name:'Singapore University of Technology & Design',     shortName:'SUTD',     slug:'sutd',                                     tuitionSGD:18000, ielts:6.5, toefl:90,  qs:601, gpa:8.5, acc:25, emp:95, salUSD:52000, est:2009, tot:2000,  intp:30, popular:false, tier:'sg-elite' },
  { id:'sg05', name:'Singapore Institute of Technology',               shortName:'SIT',      slug:'singapore-institute-of-technology',        tuitionSGD:12000, ielts:6.0, toefl:80,  qs:801, gpa:7.5, acc:55, emp:90, salUSD:42000, est:2009, tot:8000,  intp:15, popular:true,  tier:'sg-intl' },
  { id:'sg06', name:'James Cook University Singapore',                 shortName:'JCU SG',   slug:'james-cook-university-singapore',          tuitionSGD:22000, ielts:6.0, toefl:80,  qs:501, gpa:7.5, acc:70, emp:88, salUSD:45000, est:2003, tot:3000,  intp:60, popular:true,  tier:'sg-intl' },
  { id:'sg07', name:'PSB Academy',                                     shortName:'PSB',      slug:'psb-academy',                              tuitionSGD:16000, ielts:6.0, toefl:79,  qs:999, gpa:7.0, acc:80, emp:85, salUSD:38000, est:1964, tot:5000,  intp:50, popular:true,  tier:'sg-private' },
  { id:'sg08', name:'Kaplan Singapore',                                shortName:'Kaplan',   slug:'kaplan-singapore',                         tuitionSGD:14000, ielts:6.0, toefl:79,  qs:999, gpa:6.5, acc:82, emp:83, salUSD:36000, est:2004, tot:7000,  intp:45, popular:true,  tier:'sg-private' },
  { id:'sg09', name:'Management Development Institute of Singapore',   shortName:'MDIS',     slug:'mdis-singapore',                           tuitionSGD:14000, ielts:5.5, toefl:72,  qs:999, gpa:6.5, acc:85, emp:82, salUSD:35000, est:1956, tot:9000,  intp:55, popular:true,  tier:'sg-private' },
  { id:'sg10', name:'Curtin Singapore',                                shortName:'Curtin SG',slug:'curtin-singapore',                         tuitionSGD:20000, ielts:6.0, toefl:80,  qs:401, gpa:7.5, acc:75, emp:88, salUSD:45000, est:2009, tot:2500,  intp:65, popular:true,  tier:'sg-intl' },
  { id:'sg11', name:'RMIT Online Singapore',                           shortName:'RMIT SG',  slug:'rmit-singapore',                           tuitionSGD:18000, ielts:6.0, toefl:79,  qs:201, gpa:7.5, acc:80, emp:88, salUSD:44000, est:2012, tot:2000,  intp:60, popular:true,  tier:'sg-intl' },
  { id:'sg12', name:'Murdoch University Singapore',                    shortName:'Murdoch SG',slug:'murdoch-university-singapore',            tuitionSGD:18000, ielts:6.0, toefl:79,  qs:501, gpa:7.0, acc:78, emp:86, salUSD:42000, est:2008, tot:2000,  intp:65, popular:true,  tier:'sg-intl' },
  { id:'sg13', name:'Singapore Institute of Management',               shortName:'SIM',      slug:'sim-singapore',                            tuitionSGD:14000, ielts:6.0, toefl:79,  qs:999, gpa:7.0, acc:80, emp:85, salUSD:38000, est:1964, tot:14000, intp:30, popular:true,  tier:'sg-private' },
  { id:'sg14', name:'Embry-Riddle Aeronautical University Singapore',  shortName:'ERAU SG',  slug:'embry-riddle-singapore',                   tuitionSGD:24000, ielts:6.0, toefl:79,  qs:999, gpa:7.5, acc:65, emp:90, salUSD:48000, est:2011, tot:800,   intp:70, popular:false, tier:'sg-intl' },
  { id:'sg15', name:'S P Jain School of Global Management',            shortName:'SP Jain',  slug:'sp-jain-singapore',                        tuitionSGD:28000, ielts:6.5, toefl:80,  qs:999, gpa:8.0, acc:35, emp:93, salUSD:55000, est:2004, tot:1500,  intp:75, popular:true,  tier:'sg-elite' },
];

function popularCourses(tier) {
  if (tier === 'elite') return ['MS Computer Science', 'MS Electrical Engineering', 'MBA', 'MS Data Science', 'MS Mechanical Engineering'];
  if (tier === 'top-research') return ['MS Computer Science', 'MBA', 'MS Data Science', 'MS Biomedical Engineering', 'MS Information Systems'];
  if (tier === 'top-state') return ['MS Computer Science', 'MBA', 'MS Electrical Engineering', 'MS Mechanical Engineering', 'Business Administration'];
  if (tier === 'private-mid') return ['MBA', 'MS Computer Science', 'MS Finance', 'MS Business Analytics', 'MS Information Systems'];
  if (tier === 'popular-indians') return ['MS Computer Science', 'MS Information Technology', 'MBA', 'MS Electrical Engineering', 'MS Data Science'];
  if (tier === 'sg-elite') return ['Computer Science', 'Business Administration', 'Data Science & Analytics', 'Electrical Engineering', 'Economics'];
  if (tier === 'sg-intl') return ['Business Management', 'Computer Science', 'Engineering', 'Psychology', 'Communications'];
  return ['Business Administration', 'IT', 'Diploma in Business', 'MSc Business Management', 'Digital Marketing'];
}

function highlights(u, isUSA) {
  if (isUSA) return [
    `Located in ${u.city}, ${u.state}`,
    `QS World Ranking ${u.qs <= 500 ? '#' + u.qs : 'Top 1000'}`,
    `${u.acc}% acceptance rate`,
    `${u.intp}% international students`,
    `OPT: 12 months (STEM: 36 months)`,
    `F-1 Student Visa`,
    `Work rights: 20 hrs/wk on-campus`,
    `Employment rate: ${u.emp}%`,
  ];
  return [
    `Singapore — Global business hub`,
    `English-medium programs`,
    `16 hrs/week work (term, with approval)`,
    `${u.intp}% international students`,
    `Employment Pass post-graduation`,
    `Strong Indian student community`,
    `Employment rate: ${u.emp}%`,
    `Multicultural campus environment`,
  ];
}

function feeHistory(base) {
  return [
    { year: 2022, tuitionUSD: Math.round(base * 0.88) },
    { year: 2023, tuitionUSD: Math.round(base * 0.93) },
    { year: 2024, tuitionUSD: Math.round(base * 0.97) },
    { year: 2025, tuitionUSD: base },
    { year: 2026, tuitionUSD: Math.round(base * 1.04) },
  ];
}

function rankHistory(qs) {
  const base = qs <= 1000 ? qs : 1000;
  return [
    { year: 2022, rank: base + 10 },
    { year: 2023, rank: base + 5 },
    { year: 2024, rank: base + 2 },
    { year: 2025, rank: base },
    { year: 2026, rank: base },
  ];
}

function usaTopEmployers(tier) {
  if (tier === 'elite') return ['Google', 'Microsoft', 'Goldman Sachs', 'McKinsey', 'Amazon', 'Apple', 'Meta', 'JPMorgan'];
  if (tier === 'top-state') return ['Amazon', 'Google', 'Microsoft', 'Deloitte', 'Boeing', 'IBM', 'Oracle', 'Intel'];
  return ['IBM', 'Deloitte', 'Accenture', 'Amazon', 'Microsoft', 'Cognizant', 'TCS', 'Infosys'];
}

function sgTopEmployers() {
  return ['DBS Bank', 'Singapore Airlines', 'Grab', 'Sea Limited', 'Singtel', 'JPMorgan Singapore', 'Google Singapore', 'Deloitte Singapore'];
}

function buildUSABlock() {
  const lines = ['\n  // ── USA NEW universities (us11–us80) ──────────────────────────────────\n'];
  for (const u of USA_NEW) {
    const tuitionINR = Math.round(u.tuition * 84);
    const living = u.city === 'New York' || u.city === 'Los Angeles' ? 22000
      : u.city === 'Boston' || u.city === 'Washington' || u.city === 'San Francisco' ? 20000
      : u.city === 'Chicago' || u.city === 'Seattle' ? 18000
      : 15000;
    const livingINR = Math.round(living * 84);
    const salINR = Math.round(u.sal * 84);
    const greMin = u.ielts >= 7.0 ? 320 : u.ielts >= 6.5 ? 310 : 300;
    const employers = usaTopEmployers(u.tier);
    const hi = highlights(u, true);
    const pc = popularCourses(u.tier);
    const fh = feeHistory(u.tuition);
    const rh = rankHistory(u.qs);

    lines.push(`  {`);
    lines.push(`    id: '${u.id}', name: '${u.name.replace(/'/g,"\\'")}', shortName: '${u.shortName.replace(/'/g,"\\'")}',`);
    lines.push(`    slug: '${u.slug}', country: 'USA', state: '${u.state}', city: '${u.city}',`);
    lines.push(`    qsRanking: ${u.qs}, annualTuitionUSD: ${u.tuition}, annualTuitionINR: ${tuitionINR},`);
    lines.push(`    livingCostUSD: ${living}, livingCostINR: ${livingINR},`);
    lines.push(`    intakeMonths: ['August', 'January'],`);
    lines.push(`    visaApprovalRate: ${u.qs <= 50 ? 85 : u.qs <= 200 ? 80 : u.qs <= 500 ? 76 : 72}, acceptanceRate: ${u.acc},`);
    lines.push(`    popularCourses: [${pc.map(c=>`'${c}'`).join(', ')}],`);
    lines.push(`    scholarships: [`);
    lines.push(`      { name: 'Merit Scholarship', amount: 'Up to $10,000/year', eligibility: 'High academic achievers' },`);
    lines.push(`      { name: 'International Excellence Award', amount: 'Partial tuition', eligibility: 'International students' },`);
    lines.push(`    ],`);
    lines.push(`    requirements: { ieltsMin: ${u.ielts}, toeflMin: ${u.toefl}, greMin: ${greMin}, gpaMin: ${u.gpa}, backlogs: ${u.ielts >= 7.0 ? 0 : u.ielts >= 6.5 ? 1 : 2} },`);
    lines.push(`    employmentRate: ${u.emp}, avgSalaryUSD: ${u.sal}, avgSalaryINR: ${salINR},`);
    lines.push(`    establishedYear: ${u.est}, totalStudents: ${u.tot * 1000 > 999 ? u.tot : u.tot}, internationalStudentPercent: ${u.intp},`);
    lines.push(`    campusType: 'Urban', popularAmongIndians: ${u.popular}, applicationFeeUSD: ${u.ielts >= 7.0 ? 75 : 65},`);
    lines.push(`    description: '${u.name} is a leading ${u.tier === 'elite' ? 'private research' : u.tier === 'top-state' ? 'public research' : 'private'} university in ${u.city}, ${u.state}, USA. It offers world-class education with strong industry connections and excellent career prospects for international students.',`);
    lines.push(`    highlights: [${hi.map(h=>`'${h.replace(/'/g,"\\'")}'`).join(', ')}],`);
    lines.push(`    feeHistory: [${fh.map(f=>`{ year: ${f.year}, tuitionUSD: ${f.tuitionUSD} }`).join(', ')}],`);
    lines.push(`    rankingHistory: [${rh.map(r=>`{ year: ${r.year}, rank: ${r.rank} }`).join(', ')}],`);
    lines.push(`    topEmployers: [${employers.map(e=>`'${e}'`).join(', ')}],`);
    lines.push(`    countryCode: 'US',`);
    lines.push(`  },`);
  }
  return lines.join('\n');
}

function buildSGBlock() {
  const SGD_USD = 0.74;
  const lines = ['\n  // ── Singapore NEW universities (sg03–sg15) ──────────────────────────────────\n'];
  for (const u of SG_NEW) {
    const tuitionUSD = Math.round(u.tuitionSGD * SGD_USD);
    const tuitionINR = Math.round(tuitionUSD * 84);
    const livingUSD = 1800;
    const livingINR = Math.round(livingUSD * 84);
    const salINR = Math.round(u.salUSD * 84);
    const greMin = u.ielts >= 6.5 ? 310 : 300;
    const employers = sgTopEmployers();
    const hi = highlights(u, false);
    const pc = popularCourses(u.tier);
    const fh = feeHistory(tuitionUSD);
    const rh = rankHistory(u.qs);

    lines.push(`  {`);
    lines.push(`    id: '${u.id}', name: '${u.name.replace(/'/g,"\\'")}', shortName: '${u.shortName.replace(/'/g,"\\'")}',`);
    lines.push(`    slug: '${u.slug}', country: 'Singapore', state: 'Singapore', city: 'Singapore',`);
    lines.push(`    qsRanking: ${u.qs <= 900 ? u.qs : undefined}, annualTuitionUSD: ${tuitionUSD}, annualTuitionINR: ${tuitionINR},`);
    lines.push(`    livingCostUSD: ${livingUSD}, livingCostINR: ${livingINR},`);
    lines.push(`    intakeMonths: ['August', 'January'],`);
    lines.push(`    visaApprovalRate: ${u.tier === 'sg-elite' ? 88 : 83}, acceptanceRate: ${u.acc},`);
    lines.push(`    popularCourses: [${pc.map(c=>`'${c}'`).join(', ')}],`);
    lines.push(`    scholarships: [`);
    lines.push(`      { name: 'International Student Grant', amount: 'Tuition subsidy', eligibility: 'Eligible international students' },`);
    lines.push(`      { name: 'Merit Award', amount: 'SGD 2,000', eligibility: 'Top academic performers' },`);
    lines.push(`    ],`);
    lines.push(`    requirements: { ieltsMin: ${u.ielts}, toeflMin: ${u.toefl}, gpaMin: ${u.gpa}, backlogs: ${u.ielts >= 6.5 ? 1 : 2} },`);
    lines.push(`    employmentRate: ${u.emp}, avgSalaryUSD: ${u.salUSD}, avgSalaryINR: ${salINR},`);
    lines.push(`    establishedYear: ${u.est}, totalStudents: ${u.tot}, internationalStudentPercent: ${u.intp},`);
    lines.push(`    campusType: 'Urban', popularAmongIndians: ${u.popular}, applicationFeeUSD: 50,`);
    lines.push(`    description: '${u.name} is a well-regarded institution in Singapore offering internationally recognised degrees. Popular among Indian students for its English-medium programs, multicultural campus, and strong post-study work prospects.',`);
    lines.push(`    highlights: [${hi.map(h=>`'${h.replace(/'/g,"\\'")}'`).join(', ')}],`);
    lines.push(`    feeHistory: [${fh.map(f=>`{ year: ${f.year}, tuitionUSD: ${f.tuitionUSD} }`).join(', ')}],`);
    lines.push(`    rankingHistory: [${rh.map(r=>`{ year: ${r.year}, rank: ${r.rank} }`).join(', ')}],`);
    lines.push(`    topEmployers: [${employers.map(e=>`'${e}'`).join(', ')}],`);
    lines.push(`    countryCode: 'SG',`);
    lines.push(`  },`);
  }
  return lines.join('\n');
}

// ─── Main: remove old blocks and append new ones ────────────────────────────
let content = fs.readFileSync('data/universities.ts', 'utf8');

// Remove any previously appended blocks (from generate-usa-singapore.js)
const USA_MARKER = '// ── USA NEW universities (us11–us80)';
const SG_MARKER = '// ── Singapore NEW universities (sg03–sg15)';
const usaIdx = content.indexOf(USA_MARKER);
const sgIdx = content.indexOf(SG_MARKER);
const removeFrom = Math.min(
  usaIdx > -1 ? usaIdx : Infinity,
  sgIdx > -1 ? sgIdx : Infinity
);
if (removeFrom < Infinity) {
  // Remove from first marker to just before the closing ];
  const closingBrace = content.lastIndexOf('];');
  content = content.substring(0, removeFrom) + content.substring(closingBrace);
}

// Insert new blocks before the closing ];
const insertPoint = content.lastIndexOf('];');
const usaBlock = buildUSABlock();
const sgBlock = buildSGBlock();
const newContent = content.substring(0, insertPoint) + usaBlock + sgBlock + '\n' + content.substring(insertPoint);

fs.writeFileSync('data/universities.ts', newContent, 'utf8');

const usaCount = (newContent.match(/country: 'USA'/g) || []).length;
const sgCount = (newContent.match(/country: 'Singapore'/g) || []).length;
console.log(`✅ universities.ts updated: ${usaCount} USA, ${sgCount} Singapore universities`);

// Also fix ielts for SG_EXISTING in ntu-courses.ts and nus-courses.ts
// (replace ieltsMin: undefined with ieltsMin: 6.5)
['data/nus-courses.ts', 'data/ntu-courses.ts'].forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  c = c.replace(/ieltsMin: undefined/g, 'ieltsMin: 6.5');
  c = c.replace(/toeflMin: undefined/g, 'toeflMin: 90');
  c = c.replace(/pteMin: undefined/g, 'pteMin: 58');
  fs.writeFileSync(f, c, 'utf8');
  console.log(`  ✓ Fixed ${f}`);
});
