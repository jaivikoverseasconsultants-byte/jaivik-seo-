#!/usr/bin/env node
/**
 * Generator: USA (80+ total) + Singapore (15+ total) universities
 * Run: node scripts/generate-usa-singapore.js
 */
const fs = require('fs');
const path = require('path');

// ─── helpers ────────────────────────────────────────────────────────────────
function slug(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); }
function capWords(s) { return s.replace(/\b\w/g,c=>c.toUpperCase()); }
function usd2inr(u) { return Math.round(u*84); }
function ensureDir(p) { if(!fs.existsSync(p)) fs.mkdirSync(p,{recursive:true}); }

// ─── USA EXISTING (need course pages only) ─────────────────────────────────
const USA_EXISTING = [
  { id:'u1',  prefix:'mit',          slug:'mit-massachusetts',          name:'MIT',                                  city:'Cambridge',     state:'Massachusetts', tier:'ivy' },
  { id:'u2',  prefix:'stanford',     slug:'stanford-university',        name:'Stanford University',                  city:'Stanford',      state:'California',   tier:'ivy' },
  { id:'u3',  prefix:'harvard',      slug:'harvard-university',         name:'Harvard University',                   city:'Cambridge',     state:'Massachusetts', tier:'ivy' },
  { id:'u4',  prefix:'ucb',          slug:'uc-berkeley',                name:'UC Berkeley',                          city:'Berkeley',      state:'California',   tier:'top-research' },
  { id:'u5',  prefix:'cmu',          slug:'carnegie-mellon-university',  name:'Carnegie Mellon University',           city:'Pittsburgh',    state:'Pennsylvania', tier:'ivy' },
  { id:'u6',  prefix:'gatech',       slug:'georgia-tech',               name:'Georgia Institute of Technology',      city:'Atlanta',       state:'Georgia',      tier:'top-research' },
  { id:'u7',  prefix:'purdue',       slug:'purdue-university',           name:'Purdue University',                    city:'West Lafayette',state:'Indiana',      tier:'top-state' },
  { id:'u8',  prefix:'northeastern', slug:'northeastern-university',     name:'Northeastern University',              city:'Boston',        state:'Massachusetts', tier:'private-mid' },
  { id:'u9',  prefix:'asu',          slug:'arizona-state-university',    name:'Arizona State University',             city:'Tempe',         state:'Arizona',      tier:'popular-indians' },
  { id:'u10', prefix:'uiuc',         slug:'uiuc-illinois',               name:'University of Illinois Urbana-Champaign', city:'Urbana',   state:'Illinois',     tier:'top-research' },
];

// ─── USA NEW (70 universities) ──────────────────────────────────────────────
const USA_NEW = [
  // Ivy League
  { id:'us11', prefix:'yale',       slug:'yale-university',              name:'Yale University',                      city:'New Haven',     state:'Connecticut',  tuition:64000, ielts:7.0, qs:10,  tier:'ivy' },
  { id:'us12', prefix:'princeton',  slug:'princeton-university',         name:'Princeton University',                 city:'Princeton',     state:'New Jersey',   tuition:62000, ielts:7.0, qs:13,  tier:'ivy' },
  { id:'us13', prefix:'columbia',   slug:'columbia-university',          name:'Columbia University',                  city:'New York',      state:'New York',     tuition:67000, ielts:7.0, qs:12,  tier:'ivy' },
  { id:'us14', prefix:'cornell',    slug:'cornell-university',           name:'Cornell University',                   city:'Ithaca',        state:'New York',     tuition:63000, ielts:7.0, qs:14,  tier:'ivy' },
  { id:'us15', prefix:'dartmouth',  slug:'dartmouth-college',            name:'Dartmouth College',                    city:'Hanover',       state:'New Hampshire',tuition:63000, ielts:7.0, qs:250, tier:'ivy' },
  { id:'us16', prefix:'brown',      slug:'brown-university',             name:'Brown University',                     city:'Providence',    state:'Rhode Island', tuition:65000, ielts:7.0, qs:197, tier:'ivy' },
  { id:'us17', prefix:'upenn',      slug:'university-of-pennsylvania',   name:'University of Pennsylvania',           city:'Philadelphia',  state:'Pennsylvania', tuition:65000, ielts:7.0, qs:13,  tier:'ivy' },
  // Top Private Research
  { id:'us18', prefix:'caltech',    slug:'caltech',                      name:'California Institute of Technology',   city:'Pasadena',      state:'California',   tuition:60000, ielts:7.0, qs:6,   tier:'ivy' },
  { id:'us19', prefix:'jhu',        slug:'johns-hopkins-university',     name:'Johns Hopkins University',             city:'Baltimore',     state:'Maryland',     tuition:63000, ielts:6.5, qs:25,  tier:'ivy' },
  { id:'us20', prefix:'duke',       slug:'duke-university',              name:'Duke University',                      city:'Durham',        state:'North Carolina',tuition:63000, ielts:7.0, qs:67,  tier:'ivy' },
  { id:'us21', prefix:'nwestern',   slug:'northwestern-university',      name:'Northwestern University',              city:'Evanston',      state:'Illinois',     tuition:64000, ielts:7.0, qs:47,  tier:'ivy' },
  { id:'us22', prefix:'vanderbilt', slug:'vanderbilt-university',        name:'Vanderbilt University',                city:'Nashville',     state:'Tennessee',    tuition:58000, ielts:6.5, qs:246, tier:'ivy' },
  { id:'us23', prefix:'emory',      slug:'emory-university',             name:'Emory University',                     city:'Atlanta',       state:'Georgia',      tuition:58000, ielts:6.5, qs:316, tier:'top-research' },
  { id:'us24', prefix:'rice',       slug:'rice-university',              name:'Rice University',                      city:'Houston',       state:'Texas',        tuition:56000, ielts:6.5, qs:162, tier:'ivy' },
  { id:'us25', prefix:'georgetown', slug:'georgetown-university',        name:'Georgetown University',                city:'Washington',    state:'D.C.',         tuition:62000, ielts:7.0, qs:284, tier:'ivy' },
  { id:'us26', prefix:'notredame',  slug:'notre-dame-university',        name:'University of Notre Dame',             city:'Notre Dame',    state:'Indiana',      tuition:60000, ielts:6.5, qs:223, tier:'ivy' },
  { id:'us27', prefix:'tufts',      slug:'tufts-university',             name:'Tufts University',                     city:'Medford',       state:'Massachusetts',tuition:62000, ielts:6.5, qs:371, tier:'top-research' },
  { id:'us28', prefix:'bu',         slug:'boston-university',            name:'Boston University',                    city:'Boston',        state:'Massachusetts',tuition:58000, ielts:6.5, qs:113, tier:'private-mid' },
  { id:'us29', prefix:'nyu',        slug:'new-york-university',          name:'New York University',                  city:'New York',      state:'New York',     tuition:60000, ielts:6.5, qs:58,  tier:'top-research' },
  { id:'us30', prefix:'uscla',      slug:'university-of-southern-california', name:'University of Southern California', city:'Los Angeles', state:'California',  tuition:64000, ielts:6.5, qs:152, tier:'top-research' },
  { id:'us31', prefix:'fordham',    slug:'fordham-university',           name:'Fordham University',                   city:'New York',      state:'New York',     tuition:57000, ielts:6.5, qs:601, tier:'private-mid' },
  // Top State Universities
  { id:'us32', prefix:'ucla',       slug:'ucla',                         name:'University of California Los Angeles', city:'Los Angeles',   state:'California',   tuition:44000, ielts:6.5, qs:29,  tier:'top-state' },
  { id:'us33', prefix:'umich',      slug:'university-of-michigan',       name:'University of Michigan',               city:'Ann Arbor',     state:'Michigan',     tuition:52000, ielts:6.5, qs:23,  tier:'top-state' },
  { id:'us34', prefix:'utaustin',   slug:'ut-austin',                    name:'University of Texas Austin',           city:'Austin',        state:'Texas',        tuition:40000, ielts:6.5, qs:67,  tier:'top-state' },
  { id:'us35', prefix:'uncch',      slug:'unc-chapel-hill',              name:'UNC Chapel Hill',                      city:'Chapel Hill',   state:'North Carolina',tuition:36000, ielts:6.5, qs:359, tier:'top-state' },
  { id:'us36', prefix:'uw',         slug:'university-of-washington',     name:'University of Washington',             city:'Seattle',       state:'Washington',   tuition:40000, ielts:6.5, qs:59,  tier:'top-state' },
  { id:'us37', prefix:'osu',        slug:'ohio-state-university',        name:'Ohio State University',                city:'Columbus',      state:'Ohio',         tuition:36000, ielts:6.5, qs:171, tier:'top-state' },
  { id:'us38', prefix:'pennstate',  slug:'penn-state-university',        name:'Penn State University',                city:'State College', state:'Pennsylvania', tuition:38000, ielts:6.5, qs:331, tier:'top-state' },
  { id:'us39', prefix:'uf',         slug:'university-of-florida',        name:'University of Florida',                city:'Gainesville',   state:'Florida',      tuition:30000, ielts:6.0, qs:174, tier:'top-state' },
  { id:'us40', prefix:'ucsd',       slug:'uc-san-diego',                 name:'UC San Diego',                         city:'San Diego',     state:'California',   tuition:44000, ielts:6.5, qs:63,  tier:'top-state' },
  { id:'us41', prefix:'ucdavis',    slug:'uc-davis',                     name:'UC Davis',                             city:'Davis',         state:'California',   tuition:44000, ielts:6.5, qs:178, tier:'top-state' },
  { id:'us42', prefix:'ucsb',       slug:'uc-santa-barbara',             name:'UC Santa Barbara',                     city:'Santa Barbara', state:'California',   tuition:44000, ielts:6.5, qs:130, tier:'top-state' },
  { id:'us43', prefix:'vtech',      slug:'virginia-tech',                name:'Virginia Tech',                        city:'Blacksburg',    state:'Virginia',     tuition:34000, ielts:6.0, qs:401, tier:'top-state' },
  { id:'us44', prefix:'umd',        slug:'university-of-maryland',       name:'University of Maryland',               city:'College Park',  state:'Maryland',     tuition:38000, ielts:6.5, qs:146, tier:'top-state' },
  { id:'us45', prefix:'uwmadison',  slug:'university-of-wisconsin-madison', name:'University of Wisconsin–Madison',  city:'Madison',       state:'Wisconsin',    tuition:38000, ielts:6.5, qs:163, tier:'top-state' },
  { id:'us46', prefix:'umn',        slug:'university-of-minnesota',      name:'University of Minnesota',              city:'Minneapolis',   state:'Minnesota',    tuition:35000, ielts:6.5, qs:171, tier:'top-state' },
  { id:'us47', prefix:'msu',        slug:'michigan-state-university',    name:'Michigan State University',            city:'East Lansing',  state:'Michigan',     tuition:28000, ielts:6.0, qs:287, tier:'top-state' },
  { id:'us48', prefix:'iu',         slug:'indiana-university',           name:'Indiana University Bloomington',       city:'Bloomington',   state:'Indiana',      tuition:28000, ielts:6.0, qs:401, tier:'top-state' },
  { id:'us49', prefix:'cuboulder',  slug:'university-of-colorado-boulder', name:'University of Colorado Boulder',    city:'Boulder',       state:'Colorado',     tuition:36000, ielts:6.5, qs:301, tier:'top-state' },
  { id:'us50', prefix:'pitt',       slug:'university-of-pittsburgh',     name:'University of Pittsburgh',             city:'Pittsburgh',    state:'Pennsylvania', tuition:32000, ielts:6.5, qs:361, tier:'top-state' },
  { id:'us51', prefix:'tamu',       slug:'texas-am-university',          name:'Texas A&M University',                 city:'College Station',state:'Texas',       tuition:38000, ielts:6.0, qs:174, tier:'top-state' },
  { id:'us52', prefix:'rutgers',    slug:'rutgers-university',           name:'Rutgers University',                   city:'New Brunswick', state:'New Jersey',   tuition:32000, ielts:6.0, qs:355, tier:'top-state' },
  // Popular with Indians
  { id:'us53', prefix:'stonybrook', slug:'stony-brook-university',       name:'Stony Brook University',               city:'Stony Brook',   state:'New York',     tuition:26000, ielts:6.0, qs:401, tier:'popular-indians' },
  { id:'us54', prefix:'sunybuffalo',slug:'suny-buffalo',                 name:'University at Buffalo (SUNY)',         city:'Buffalo',       state:'New York',     tuition:24000, ielts:6.0, qs:461, tier:'popular-indians' },
  { id:'us55', prefix:'illinoistech',slug:'illinois-tech',              name:'Illinois Institute of Technology',     city:'Chicago',       state:'Illinois',     tuition:32000, ielts:6.0, qs:501, tier:'popular-indians' },
  { id:'us56', prefix:'depaul',     slug:'depaul-university',            name:'DePaul University',                    city:'Chicago',       state:'Illinois',     tuition:24000, ielts:6.0, qs:801, tier:'popular-indians' },
  { id:'us57', prefix:'udayton',    slug:'university-of-dayton',         name:'University of Dayton',                 city:'Dayton',        state:'Ohio',         tuition:22000, ielts:6.0, qs:801, tier:'popular-indians' },
  { id:'us58', prefix:'clarku',     slug:'clark-university',             name:'Clark University',                     city:'Worcester',     state:'Massachusetts',tuition:22000, ielts:6.0, qs:801, tier:'popular-indians' },
  { id:'us59', prefix:'wpi',        slug:'wpi',                          name:'Worcester Polytechnic Institute',      city:'Worcester',     state:'Massachusetts',tuition:28000, ielts:6.0, qs:601, tier:'popular-indians' },
  { id:'us60', prefix:'pace',       slug:'pace-university',              name:'Pace University',                      city:'New York',      state:'New York',     tuition:20000, ielts:6.0, qs:1001,tier:'popular-indians' },
  { id:'us61', prefix:'bridgeport', slug:'university-of-bridgeport',     name:'University of Bridgeport',             city:'Bridgeport',    state:'Connecticut',  tuition:18000, ielts:6.0, qs:1001,tier:'popular-indians' },
  { id:'us62', prefix:'fduus',      slug:'fairleigh-dickinson-university', name:'Fairleigh Dickinson University',     city:'Teaneck',       state:'New Jersey',   tuition:18000, ielts:6.0, qs:1001,tier:'popular-indians' },
  { id:'us63', prefix:'webster',    slug:'webster-university',           name:'Webster University',                   city:'Webster Groves',state:'Missouri',     tuition:18000, ielts:6.0, qs:1001,tier:'popular-indians' },
  { id:'us64', prefix:'gwu',        slug:'george-washington-university', name:'George Washington University',         city:'Washington',    state:'D.C.',         tuition:32000, ielts:6.5, qs:601, tier:'private-mid' },
  { id:'us65', prefix:'american',   slug:'american-university',          name:'American University',                  city:'Washington',    state:'D.C.',         tuition:30000, ielts:6.5, qs:801, tier:'private-mid' },
  { id:'us66', prefix:'drexel',     slug:'drexel-university',            name:'Drexel University',                    city:'Philadelphia',  state:'Pennsylvania', tuition:26000, ielts:6.0, qs:601, tier:'private-mid' },
  { id:'us67', prefix:'temple',     slug:'temple-university',            name:'Temple University',                    city:'Philadelphia',  state:'Pennsylvania', tuition:22000, ielts:6.0, qs:601, tier:'popular-indians' },
  { id:'us68', prefix:'uconn',      slug:'university-of-connecticut',    name:'University of Connecticut',            city:'Storrs',        state:'Connecticut',  tuition:24000, ielts:6.0, qs:501, tier:'top-state' },
  { id:'us69', prefix:'rit',        slug:'rochester-institute-of-technology', name:'Rochester Institute of Technology', city:'Rochester',  state:'New York',     tuition:26000, ielts:6.0, qs:601, tier:'popular-indians' },
  { id:'us70', prefix:'stevens',    slug:'stevens-institute-of-technology', name:'Stevens Institute of Technology',   city:'Hoboken',      state:'New Jersey',   tuition:28000, ielts:6.0, qs:801, tier:'popular-indians' },
  { id:'us71', prefix:'rpi',        slug:'rensselaer-polytechnic',       name:'Rensselaer Polytechnic Institute',     city:'Troy',          state:'New York',     tuition:28000, ielts:6.0, qs:601, tier:'popular-indians' },
  { id:'us72', prefix:'uarizona',   slug:'university-of-arizona',        name:'University of Arizona',                city:'Tucson',        state:'Arizona',      tuition:22000, ielts:6.0, qs:401, tier:'top-state' },
  { id:'us73', prefix:'colostate',  slug:'colorado-state-university',    name:'Colorado State University',            city:'Fort Collins',  state:'Colorado',     tuition:20000, ielts:6.0, qs:601, tier:'top-state' },
  { id:'us74', prefix:'uutah',      slug:'university-of-utah',           name:'University of Utah',                   city:'Salt Lake City',state:'Utah',         tuition:22000, ielts:6.0, qs:501, tier:'top-state' },
  { id:'us75', prefix:'urochester', slug:'university-of-rochester',      name:'University of Rochester',              city:'Rochester',     state:'New York',     tuition:32000, ielts:6.5, qs:284, tier:'top-research' },
  { id:'us76', prefix:'cwru',       slug:'case-western-reserve-university', name:'Case Western Reserve University',  city:'Cleveland',     state:'Ohio',         tuition:32000, ielts:6.5, qs:284, tier:'top-research' },
  { id:'us77', prefix:'ncstate',    slug:'nc-state-university',          name:'NC State University',                  city:'Raleigh',       state:'North Carolina',tuition:22000, ielts:6.0, qs:401, tier:'top-state' },
  { id:'us78', prefix:'iowastate',  slug:'iowa-state-university',        name:'Iowa State University',                city:'Ames',          state:'Iowa',         tuition:20000, ielts:6.0, qs:601, tier:'top-state' },
  { id:'us79', prefix:'ucincinnati',slug:'university-of-cincinnati',     name:'University of Cincinnati',             city:'Cincinnati',    state:'Ohio',         tuition:22000, ielts:6.0, qs:601, tier:'top-state' },
  { id:'us80', prefix:'udel',       slug:'university-of-delaware',       name:'University of Delaware',               city:'Newark',        state:'Delaware',     tuition:20000, ielts:6.0, qs:601, tier:'popular-indians' },
];

// ─── SINGAPORE EXISTING (need course pages only) ────────────────────────────
const SG_EXISTING = [
  { id:'u26', prefix:'nus', slug:'national-university-of-singapore', name:'National University of Singapore', city:'Singapore', state:'Singapore', tier:'sg-elite' },
  { id:'u27', prefix:'ntu', slug:'nanyang-technological-university',  name:'Nanyang Technological University',  city:'Singapore', state:'Singapore', tier:'sg-elite' },
];

// ─── SINGAPORE NEW ───────────────────────────────────────────────────────────
const SG_NEW = [
  { id:'sg03', prefix:'smu',      slug:'singapore-management-university',  name:'Singapore Management University',     tuitionSGD:20000, ielts:6.5, tier:'sg-elite' },
  { id:'sg04', prefix:'sutd',     slug:'sutd',                              name:'Singapore University of Technology & Design', tuitionSGD:18000, ielts:6.5, tier:'sg-elite' },
  { id:'sg05', prefix:'sit',      slug:'singapore-institute-of-technology',name:'Singapore Institute of Technology',    tuitionSGD:12000, ielts:6.0, tier:'sg-intl' },
  { id:'sg06', prefix:'jcusg',    slug:'james-cook-university-singapore',  name:'James Cook University Singapore',      tuitionSGD:22000, ielts:6.0, tier:'sg-intl' },
  { id:'sg07', prefix:'psbsg',    slug:'psb-academy',                      name:'PSB Academy',                          tuitionSGD:16000, ielts:6.0, tier:'sg-private' },
  { id:'sg08', prefix:'kaplansg', slug:'kaplan-singapore',                 name:'Kaplan Singapore',                     tuitionSGD:14000, ielts:6.0, tier:'sg-private' },
  { id:'sg09', prefix:'mdis',     slug:'mdis-singapore',                   name:'Management Development Institute of Singapore', tuitionSGD:14000, ielts:5.5, tier:'sg-private' },
  { id:'sg10', prefix:'curtinsg', slug:'curtin-singapore',                 name:'Curtin Singapore',                     tuitionSGD:20000, ielts:6.0, tier:'sg-intl' },
  { id:'sg11', prefix:'rmitsg',   slug:'rmit-singapore',                   name:'RMIT Online Singapore',                tuitionSGD:18000, ielts:6.0, tier:'sg-intl' },
  { id:'sg12', prefix:'murdochsg',slug:'murdoch-university-singapore',     name:'Murdoch University Singapore',         tuitionSGD:18000, ielts:6.0, tier:'sg-intl' },
  { id:'sg13', prefix:'simsg',    slug:'sim-singapore',                    name:'Singapore Institute of Management',    tuitionSGD:14000, ielts:6.0, tier:'sg-private' },
  { id:'sg14', prefix:'embry',    slug:'embry-riddle-singapore',           name:'Embry-Riddle Aeronautical University Singapore', tuitionSGD:24000, ielts:6.0, tier:'sg-intl' },
  { id:'sg15', prefix:'spjain',   slug:'sp-jain-singapore',                name:'S P Jain School of Global Management', tuitionSGD:28000, ielts:6.5, tier:'sg-elite' },
];

// ─── Course templates ────────────────────────────────────────────────────────

function usaCourses(u, tuitionUSD) {
  const living = u.city === 'New York' || u.city === 'Los Angeles' ? 2200
    : u.city === 'Boston' || u.city === 'San Francisco' || u.city === 'Stanford' ? 2000
    : u.city === 'Washington' || u.city === 'Seattle' ? 1900
    : u.city === 'Chicago' || u.city === 'Cambridge' ? 1800
    : 1500;

  const ivyCourses = [
    { name:'Computer Science', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Master of Science in Computer Science', dur:'1.5 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'MBA', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.1) },
    { name:'Electrical Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Master of Engineering in Electrical Engineering', dur:'1 year', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Data Science', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Mechanical Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Economics', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Mathematics', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Physics', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Political Science', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Psychology', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Finance', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.05) },
    { name:'Artificial Intelligence', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Biomedical Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Chemical Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Business Analytics', dur:'1.5 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Public Policy', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Law (JD)', dur:'3 years', lvl:'Doctoral', fee: Math.round(tuitionUSD*1.1) },
    { name:'Medicine (MD)', dur:'4 years', lvl:'Doctoral', fee: Math.round(tuitionUSD*1.2) },
    { name:'International Relations', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Environmental Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Statistics', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Architecture', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Civil Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Information Systems', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Cybersecurity', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Materials Science & Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Applied Mathematics', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Accounting', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Marketing', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.0) },
    { name:'Human-Computer Interaction', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Robotics', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Supply Chain Management', dur:'1.5 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Healthcare Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.0) },
    { name:'Software Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Aerospace Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Industrial Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Operations Research', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Sociology', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'English Literature', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'History', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Philosophy', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Neuroscience', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Bioinformatics', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Computational Biology', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Urban Planning', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Education Policy', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Journalism', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Film & Media Studies', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Design Engineering', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Quantum Computing', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Machine Learning', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Cloud Computing', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Financial Engineering', dur:'1.5 years', lvl:'Master', fee: Math.round(tuitionUSD*1.05) },
    { name:'Entrepreneurship', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.0) },
    { name:'Sustainable Development', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Global Health', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Cognitive Science', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Operations Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.0) },
    { name:'Strategic Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.0) },
    { name:'Organizational Behaviour', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
  ];

  const topResearchCourses = ivyCourses.slice(0, 50);

  const topStateCourses = [
    { name:'Computer Science', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'MS Computer Science', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'MBA', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.05) },
    { name:'Electrical Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'MS Electrical Engineering', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Data Science', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Mechanical Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'MS Mechanical Engineering', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Civil Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Business Administration', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Information Technology', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'MS Information Systems', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Finance', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.0) },
    { name:'Accounting', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Nursing', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Psychology', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Marketing', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Economics', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Cybersecurity', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Supply Chain Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Public Health', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Environmental Science', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Software Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Biotechnology', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Agricultural Science', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Architecture', dur:'5 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Applied Mathematics', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Chemistry', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Physics', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Statistics', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'MS Statistics', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Journalism', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Communications', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Political Science', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Social Work', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.85) },
    { name:'Healthcare Administration', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Construction Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Engineering Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Artificial Intelligence', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
  ];

  const popularIndiansCourses = [
    { name:'MS Computer Science', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'MS Information Technology', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'MS Electrical Engineering', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'MBA', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.1) },
    { name:'MS Data Science', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'MS Cybersecurity', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'Bachelor of Computer Science', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Bachelor of Information Technology', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Bachelor of Business Administration', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'MS Software Engineering', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'MS Mechanical Engineering', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'MS Civil Engineering', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'Finance', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*1.05) },
    { name:'MS Business Analytics', dur:'1.5 years', lvl:'Master', fee: tuitionUSD },
    { name:'MS Artificial Intelligence', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'Project Management', dur:'1.5 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Computer Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'MS Supply Chain Management', dur:'1.5 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Healthcare Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Accounting', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Applied Machine Learning', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'Human Resources Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'MS Biotechnology', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'Cloud Computing', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'Network Security', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'Engineering Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'MS Computer Networks', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'MS Data Analytics', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'Digital Marketing', dur:'1.5 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'Tourism & Hospitality Management', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.9) },
    { name:'International Business', dur:'2 years', lvl:'Master', fee: Math.round(tuitionUSD*0.95) },
    { name:'Pharmacy', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Biomedical Sciences', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'MS Robotics', dur:'2 years', lvl:'Master', fee: tuitionUSD },
    { name:'Aerospace Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Environmental Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Industrial Engineering', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Physics', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
    { name:'Mathematics', dur:'4 years', lvl:'Bachelor', fee: tuitionUSD },
  ];

  const map = { ivy: ivyCourses, 'top-research': topResearchCourses, 'top-state': topStateCourses, 'private-mid': topResearchCourses.slice(0,39), 'popular-indians': popularIndiansCourses };
  const list = map[u.tier] || topStateCourses;

  return list.map((c, i) => ({
    id: `${u.prefix}-c${String(i+1).padStart(3,'0')}`,
    name: c.name,
    slug: slug(c.name),
    url: `https://www.${u.slug.replace(/-/g,'')}.edu`,
    level: c.lvl,
    studyLevel: c.lvl,
    duration: c.dur,
    durationYears: parseFloat(c.dur),
    annualUSD: c.fee,
    annualINR: usd2inr(c.fee),
    totalUSD: c.fee * parseFloat(c.dur),
    livingCostUSD: living,
    livingCostINR: usd2inr(living),
    ieltsMin: u.ielts || 6.5,
    toeflMin: u.ielts >= 7.0 ? 100 : u.ielts >= 6.5 ? 90 : 80,
    pteMin: u.ielts >= 7.0 ? 68 : u.ielts >= 6.5 ? 58 : 50,
    intakeMonths: ['August', 'January'],
    campus: u.city,
    country: 'USA',
    state: u.state,
    city: u.city,
    countryCode: 'US',
  }));
}

function sgCourses(u, tuitionSGD) {
  const SGD_USD = 0.74;
  const SGD_INR = 62;
  const livingSGD = 1800;

  const eliteCourses = [
    { name:'Computer Science', dur:'4 years', lvl:'Bachelor' },
    { name:'MSc Computer Science', dur:'1 year', lvl:'Master' },
    { name:'MBA', dur:'1 year', lvl:'Master' },
    { name:'Business Administration', dur:'4 years', lvl:'Bachelor' },
    { name:'Electrical Engineering', dur:'4 years', lvl:'Bachelor' },
    { name:'MSc Electrical Engineering', dur:'1 year', lvl:'Master' },
    { name:'Data Science & Analytics', dur:'4 years', lvl:'Bachelor' },
    { name:'MSc Data Science', dur:'1 year', lvl:'Master' },
    { name:'Economics', dur:'4 years', lvl:'Bachelor' },
    { name:'MSc Economics', dur:'1 year', lvl:'Master' },
    { name:'Mechanical Engineering', dur:'4 years', lvl:'Bachelor' },
    { name:'Civil Engineering', dur:'4 years', lvl:'Bachelor' },
    { name:'Chemical Engineering', dur:'4 years', lvl:'Bachelor' },
    { name:'Accountancy', dur:'4 years', lvl:'Bachelor' },
    { name:'Finance', dur:'4 years', lvl:'Bachelor' },
    { name:'MSc Finance', dur:'1 year', lvl:'Master' },
    { name:'Real Estate', dur:'4 years', lvl:'Bachelor' },
    { name:'Architecture', dur:'4 years', lvl:'Bachelor' },
    { name:'Law (LLB)', dur:'4 years', lvl:'Bachelor' },
    { name:'Medicine (MBBS)', dur:'5 years', lvl:'Bachelor' },
    { name:'Nursing', dur:'4 years', lvl:'Bachelor' },
    { name:'Pharmacy', dur:'4 years', lvl:'Bachelor' },
    { name:'Information Systems', dur:'4 years', lvl:'Bachelor' },
    { name:'MSc Information Systems', dur:'1 year', lvl:'Master' },
    { name:'MSc Artificial Intelligence', dur:'1 year', lvl:'Master' },
    { name:'Biomedical Engineering', dur:'4 years', lvl:'Bachelor' },
    { name:'MSc Biomedical Engineering', dur:'1 year', lvl:'Master' },
    { name:'Computer Engineering', dur:'4 years', lvl:'Bachelor' },
    { name:'MSc Cybersecurity', dur:'1 year', lvl:'Master' },
    { name:'MSc Business Analytics', dur:'1 year', lvl:'Master' },
    { name:'MSc Marketing', dur:'1 year', lvl:'Master' },
    { name:'MSc Supply Chain Management', dur:'1 year', lvl:'Master' },
    { name:'Communications & New Media', dur:'4 years', lvl:'Bachelor' },
    { name:'Psychology', dur:'4 years', lvl:'Bachelor' },
    { name:'Sociology', dur:'4 years', lvl:'Bachelor' },
    { name:'Political Science', dur:'4 years', lvl:'Bachelor' },
    { name:'Philosophy', dur:'4 years', lvl:'Bachelor' },
    { name:'Mathematics', dur:'4 years', lvl:'Bachelor' },
    { name:'Statistics', dur:'4 years', lvl:'Bachelor' },
    { name:'Physics', dur:'4 years', lvl:'Bachelor' },
    { name:'Chemistry', dur:'4 years', lvl:'Bachelor' },
    { name:'Life Sciences', dur:'4 years', lvl:'Bachelor' },
    { name:'Environmental Studies', dur:'4 years', lvl:'Bachelor' },
    { name:'MSc Environmental Management', dur:'1 year', lvl:'Master' },
    { name:'MSc Public Policy', dur:'1 year', lvl:'Master' },
    { name:'MSc Applied Economics', dur:'1 year', lvl:'Master' },
    { name:'MSc Industrial & Systems Engineering', dur:'1 year', lvl:'Master' },
    { name:'MSc Technology Management', dur:'1 year', lvl:'Master' },
    { name:'Executive MBA', dur:'1 year', lvl:'Master' },
    { name:'MSc Digital Leadership', dur:'1 year', lvl:'Master' },
  ];

  const intlCourses = eliteCourses.slice(0, 39);

  const privateCourses = [
    { name:'Bachelor of Business', dur:'3 years', lvl:'Bachelor' },
    { name:'Business & Information Technology', dur:'3 years', lvl:'Bachelor' },
    { name:'Diploma in Business', dur:'2 years', lvl:'Diploma' },
    { name:'Diploma in IT', dur:'2 years', lvl:'Diploma' },
    { name:'MSc Business Management', dur:'1 year', lvl:'Master' },
    { name:'MSc Information Technology', dur:'1 year', lvl:'Master' },
    { name:'Bachelor of Science in Nursing', dur:'3 years', lvl:'Bachelor' },
    { name:'Diploma in Hospitality', dur:'2 years', lvl:'Diploma' },
    { name:'MSc Finance & Accounting', dur:'1 year', lvl:'Master' },
    { name:'Bachelor of Psychology', dur:'3 years', lvl:'Bachelor' },
    { name:'Diploma in Culinary Arts', dur:'2 years', lvl:'Diploma' },
    { name:'MSc Human Resource Management', dur:'1 year', lvl:'Master' },
    { name:'Bachelor of Social Work', dur:'3 years', lvl:'Bachelor' },
    { name:'Bachelor of Mass Communication', dur:'3 years', lvl:'Bachelor' },
    { name:'MSc Digital Marketing', dur:'1 year', lvl:'Master' },
    { name:'MSc Project Management', dur:'1 year', lvl:'Master' },
    { name:'Bachelor of Engineering', dur:'3 years', lvl:'Bachelor' },
    { name:'MSc Supply Chain & Logistics', dur:'1 year', lvl:'Master' },
    { name:'Diploma in Accounting', dur:'2 years', lvl:'Diploma' },
    { name:'Bachelor of Commerce', dur:'3 years', lvl:'Bachelor' },
    { name:'MSc International Business', dur:'1 year', lvl:'Master' },
    { name:'Diploma in Design', dur:'2 years', lvl:'Diploma' },
    { name:'Bachelor of Tourism Management', dur:'3 years', lvl:'Bachelor' },
    { name:'MSc Healthcare Management', dur:'1 year', lvl:'Master' },
    { name:'Bachelor of Early Childhood Education', dur:'3 years', lvl:'Bachelor' },
  ];

  const map = { 'sg-elite': eliteCourses, 'sg-intl': intlCourses, 'sg-private': privateCourses };
  const list = map[u.tier] || intlCourses;

  return list.map((c, i) => ({
    id: `${u.prefix}-c${String(i+1).padStart(3,'0')}`,
    name: c.name,
    slug: slug(c.name),
    url: `https://www.${u.prefix}.edu.sg`,
    level: c.lvl,
    studyLevel: c.lvl,
    duration: c.dur,
    durationYears: parseFloat(c.dur),
    annualSGD: tuitionSGD,
    annualUSD: Math.round(tuitionSGD * SGD_USD),
    annualINR: Math.round(tuitionSGD * SGD_INR),
    totalSGD: tuitionSGD * parseFloat(c.dur),
    livingCostSGD: livingSGD,
    livingCostUSD: Math.round(livingSGD * SGD_USD),
    livingCostINR: Math.round(livingSGD * SGD_INR),
    ieltsMin: u.ielts,
    toeflMin: u.ielts >= 7.0 ? 100 : u.ielts >= 6.5 ? 90 : 80,
    pteMin: u.ielts >= 7.0 ? 68 : u.ielts >= 6.5 ? 58 : 50,
    intakeMonths: ['August', 'January'],
    campus: 'Singapore',
    country: 'Singapore',
    state: 'Singapore',
    city: 'Singapore',
    countryCode: 'SG',
  }));
}

// ─── Default tuition for existing unis ─────────────────────────────────────
const USA_EXISTING_TUITION = {
  mit: 60000, stanford: 62000, harvard: 58000, ucb: 46000,
  cmu: 60000, gatech: 36000, purdue: 32000, northeastern: 58000,
  asu: 18000, uiuc: 36000,
};
const SG_EXISTING_TUITION = { nus: 30000, ntu: 28000 }; // SGD

// ─── Writers ────────────────────────────────────────────────────────────────

function writeUSADataFile(u, courses) {
  const iface = `${u.prefix[0].toUpperCase()}${u.prefix.slice(1)}Course`;
  const lines = [
    `export interface ${iface} {`,
    `  id: string; name: string; slug: string; url: string;`,
    `  level: string; studyLevel: string; duration: string; durationYears: number;`,
    `  annualUSD: number; annualINR: number; totalUSD: number;`,
    `  livingCostUSD: number; livingCostINR: number;`,
    `  ieltsMin: number; toeflMin: number; pteMin: number;`,
    `  intakeMonths: string[]; campus: string;`,
    `  country: string; state: string; city: string; countryCode: string;`,
    `}`,
    ``,
    `export const ${u.prefix}Courses: ${iface}[] = [`,
  ];
  for (const c of courses) {
    lines.push(`  {`);
    lines.push(`    id: '${c.id}', name: '${c.name.replace(/'/g,"\\'")}', slug: '${c.slug}', url: '${c.url}',`);
    lines.push(`    level: '${c.level}', studyLevel: '${c.studyLevel}', duration: '${c.duration}', durationYears: ${c.durationYears},`);
    lines.push(`    annualUSD: ${c.annualUSD}, annualINR: ${c.annualINR}, totalUSD: ${c.totalUSD},`);
    lines.push(`    livingCostUSD: ${c.livingCostUSD}, livingCostINR: ${c.livingCostINR},`);
    lines.push(`    ieltsMin: ${c.ieltsMin}, toeflMin: ${c.toeflMin}, pteMin: ${c.pteMin},`);
    lines.push(`    intakeMonths: [${c.intakeMonths.map(m=>`'${m}'`).join(', ')}], campus: '${c.campus}',`);
    lines.push(`    country: '${c.country}', state: '${c.state}', city: '${c.city}', countryCode: '${c.countryCode}',`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(`export default ${u.prefix}Courses;`);
  const out = path.join('data', `${u.prefix}-courses.ts`);
  fs.writeFileSync(out, lines.join('\n'), 'utf8');
  console.log(`  ✓ ${out} (${courses.length} courses)`);
}

function writeSGDataFile(u, courses) {
  const iface = `${u.prefix[0].toUpperCase()}${u.prefix.slice(1)}Course`;
  const lines = [
    `export interface ${iface} {`,
    `  id: string; name: string; slug: string; url: string;`,
    `  level: string; studyLevel: string; duration: string; durationYears: number;`,
    `  annualSGD: number; annualUSD: number; annualINR: number; totalSGD: number;`,
    `  livingCostSGD: number; livingCostUSD: number; livingCostINR: number;`,
    `  ieltsMin: number; toeflMin: number; pteMin: number;`,
    `  intakeMonths: string[]; campus: string;`,
    `  country: string; state: string; city: string; countryCode: string;`,
    `}`,
    ``,
    `export const ${u.prefix}Courses: ${iface}[] = [`,
  ];
  for (const c of courses) {
    lines.push(`  {`);
    lines.push(`    id: '${c.id}', name: '${c.name.replace(/'/g,"\\'")}', slug: '${c.slug}', url: '${c.url}',`);
    lines.push(`    level: '${c.level}', studyLevel: '${c.studyLevel}', duration: '${c.duration}', durationYears: ${c.durationYears},`);
    lines.push(`    annualSGD: ${c.annualSGD}, annualUSD: ${c.annualUSD}, annualINR: ${c.annualINR}, totalSGD: ${c.totalSGD},`);
    lines.push(`    livingCostSGD: ${c.livingCostSGD}, livingCostUSD: ${c.livingCostUSD}, livingCostINR: ${c.livingCostINR},`);
    lines.push(`    ieltsMin: ${c.ieltsMin}, toeflMin: ${c.toeflMin}, pteMin: ${c.pteMin},`);
    lines.push(`    intakeMonths: [${c.intakeMonths.map(m=>`'${m}'`).join(', ')}], campus: '${c.campus}',`);
    lines.push(`    country: '${c.country}', state: '${c.state}', city: '${c.city}', countryCode: '${c.countryCode}',`);
    lines.push(`  },`);
  }
  lines.push(`];`);
  lines.push(`export default ${u.prefix}Courses;`);
  const out = path.join('data', `${u.prefix}-courses.ts`);
  fs.writeFileSync(out, lines.join('\n'), 'utf8');
  console.log(`  ✓ ${out} (${courses.length} courses)`);
}

function writeCoursesListPage(u, courses, currency) {
  const isUSA = currency === 'USD';
  const isSG = currency === 'SGD';
  const iface = `${u.prefix[0].toUpperCase()}${u.prefix.slice(1)}Course`;
  const dir = path.join('app', 'universities', u.slug, 'courses');
  ensureDir(dir);

  const priceDisplay = isUSA
    ? `\`$\${(c.annualUSD/1000).toFixed(0)}K/yr\``
    : `\`S$\${(c.annualSGD/1000).toFixed(0)}K/yr\``;
  const totalDisplay = isUSA
    ? `\`$\${Math.round(c.totalUSD/1000)}K total\``
    : `\`S$\${Math.round(c.totalSGD/1000)}K total\``;

  const content = `import Link from 'next/link';
import type { Metadata } from 'next';
import { ${u.prefix}Courses } from '@/data/${u.prefix}-courses';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: '${u.name} Courses & Programs 2026 – Fees, IELTS & Intakes',
  description: '${courses.length} programs at ${u.name} for Indian students. Tuition, IELTS requirements, intake dates. Free counselling by Jaivik Overseas.',
  path: '/universities/${u.slug}/courses',
});

const levels = ['All', 'Bachelor', 'Master', 'Doctoral', 'Diploma'];

export default function ${iface.replace('Course','')}CoursesPage() {
  const courses = ${u.prefix}Courses;
  const avgFee = Math.round(courses.reduce((s,c)=>s+c.${isUSA?'annualUSD':'annualSGD'},0)/courses.length);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <Link href="/universities" className="hover:text-brand-700">Universities</Link> /
        <Link href="/universities/${u.slug}" className="hover:text-brand-700">${u.name}</Link> /
        <span className="text-gray-800 font-medium">Courses</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">${u.name} — All Courses & Programs 2026</h1>
        <p className="text-gray-500">{courses.length} programs listed · ${isUSA?`Avg ~$\${Math.round(avgFee/1000)}K USD/yr`:`Avg ~S$\${Math.round(avgFee/1000)}K SGD/yr`}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm sticky top-20">
            <h3 className="font-bold text-gray-900 mb-3 text-sm">Quick Facts</h3>
            {[
              ['Programs', courses.length.toString()],
              ['Min IELTS', courses[0]?.ieltsMin + '+'],
              ['Intake', 'Aug & Jan'],
              ['Country', '${isUSA?'USA':'Singapore'}'],
              ['Work Rights', '${isUSA?'20 hrs/wk on-campus':'16 hrs/wk (with approval)'}'],
              ['Post-Study', '${isUSA?'OPT 12–36 months':'Employment Pass eligible'}'],
            ].map(([k,v])=>(
              <div key={k} className="flex justify-between py-2 border-b border-gray-50 last:border-0 text-xs">
                <span className="text-gray-500">{k}</span>
                <span className="font-semibold text-gray-900 text-right">{v}</span>
              </div>
            ))}
            <Link href="/book-counselling" className="btn-primary w-full text-center mt-4 block text-sm">
              Free Counselling →
            </Link>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-3">
          {courses.map(c => (
            <Link key={c.id} href={\`/universities/${u.slug}/courses/\${c.slug}\`}
              className="block bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-md hover:border-brand-200 transition-all">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-bold text-gray-900 hover:text-brand-700 text-sm">{c.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{c.level} · {c.duration} · {c.campus}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">IELTS {c.ieltsMin}+</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{c.intakeMonths.join(' & ')}</span>
                  </div>
                </div>
                <div className="text-right whitespace-nowrap">
                  <p className="font-bold text-brand-700 text-sm">${isUSA?`$\${(c.annualUSD/1000).toFixed(0)}K/yr`:`S$\${(c.annualSGD/1000).toFixed(0)}K/yr`}</p>
                  <p className="text-xs text-gray-400">≈ ₹{(c.annualINR/100000).toFixed(1)}L/yr</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content, 'utf8');
}

function writeCourseDetailPage(u, currency) {
  const isUSA = currency === 'USD';
  const iface = `${u.prefix[0].toUpperCase()}${u.prefix.slice(1)}Course`;
  const dir = path.join('app', 'universities', u.slug, 'courses', '[slug]');
  ensureDir(dir);

  const content = `import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ${u.prefix}Courses } from '@/data/${u.prefix}-courses';
import { buildMetadata } from '@/lib/seo';
import LeadForm from '@/components/LeadForm';

export function generateStaticParams() {
  return ${u.prefix}Courses.map(c => ({ slug: c.slug }));
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const c = ${u.prefix}Courses.find(x => x.slug === slug);
  if (!c) return {};
  return buildMetadata({
    title: \`\${c.name} at ${u.name} 2026 – Fees, IELTS & Requirements\`,
    description: \`\${c.name} at ${u.name}: \${c.duration}, ${isUSA?`$\${(c.annualUSD/1000).toFixed(0)}K USD/yr`:`S$\${(c.annualSGD/1000).toFixed(0)}K SGD/yr`}. IELTS \${c.ieltsMin}+. Apply via Jaivik Overseas Consultants.\`,
    path: \`/universities/${u.slug}/courses/\${slug}\`,
  });
}

export default async function CourseDetailPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const c = ${u.prefix}Courses.find(x => x.slug === slug);
  if (!c) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-6 flex-wrap">
        <Link href="/" className="hover:text-brand-700">Home</Link> /
        <Link href="/universities" className="hover:text-brand-700">Universities</Link> /
        <Link href="/universities/${u.slug}" className="hover:text-brand-700">${u.name}</Link> /
        <Link href="/universities/${u.slug}/courses" className="hover:text-brand-700">Courses</Link> /
        <span className="text-gray-800 font-medium">{c.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <div className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
              ${isUSA?'🇺🇸 USA':'🇸🇬 Singapore'} · {c.level}
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{c.name}</h1>
            <p className="text-gray-500 text-sm">${u.name} · {c.city}, {c.state}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
              {[
                { label: 'Duration', value: c.duration },
                { label: 'Level', value: c.level },
                { label: '${isUSA?'Annual Fee (USD)':'Annual Fee (SGD)'}', value: '${isUSA?`$\${(c.annualUSD/1000).toFixed(0)}K`:`S$\${(c.annualSGD/1000).toFixed(0)}K`}' },
                { label: 'Annual Fee (INR)', value: \`₹\${(c.annualINR/100000).toFixed(1)}L\` },
              ].map(s => (
                <div key={s.label} className="bg-brand-50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-brand-700">{s.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Admission Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'IELTS', value: \`\${c.ieltsMin}+ overall\` },
                { label: 'TOEFL', value: \`\${c.toeflMin}+ iBT\` },
                { label: 'PTE', value: \`\${c.pteMin}+\` },
                { label: 'Intake', value: c.intakeMonths.join(' & ') },
                { label: 'Living Cost', value: '${isUSA?`~$\${(c.livingCostUSD).toLocaleString()}/mo`:`~S$\${(c.livingCostSGD).toLocaleString()}/mo`}' },
                { label: 'Work Rights', value: '${isUSA?'20 hrs/wk (on-campus)':'16 hrs/wk (with approval)'}' },
              ].map(r => (
                <div key={r.label} className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 font-medium mb-1">{r.label}</p>
                  <p className="text-sm font-semibold text-gray-900">{r.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Cost Summary (Full Course)</h2>
            <div className="space-y-3">
              {[
                ['Tuition (Total)', '${isUSA?`$\${Math.round(c.totalUSD/1000)}K USD`:`S$\${Math.round(c.totalSGD/1000)}K SGD`}'],
                ['Living Cost (Total)', '${isUSA?`~$\${Math.round(c.livingCostUSD*12*c.durationYears/1000)}K USD`:`~S$\${Math.round(c.livingCostSGD*12*c.durationYears/1000)}K SGD`}'],
                ['Approx. Total in INR', \`≈ ₹\${((c.annualINR * c.durationYears)/100000).toFixed(1)}L\`],
              ].map(([k,v])=>(
                <div key={k} className="flex justify-between items-center py-3 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-600">{k}</span>
                  <span className="font-bold text-gray-900">{v}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-brand-700 rounded-2xl p-6 text-white text-center">
            <h2 className="text-lg font-bold mb-2">Apply for {c.name} at ${u.name}</h2>
            <p className="text-blue-200 text-sm mb-4">Our experts guide you from application to visa. 500+ students placed.</p>
            <Link href="/book-counselling" className="btn-gold inline-block">Book Free Counselling →</Link>
          </div>
        </div>

        <div>
          <div className="sticky top-20 space-y-5">
            <LeadForm source="${u.slug}-course" defaultCountry="${isUSA?'USA':'Singapore'}" />
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-3 text-sm">More Programs at ${u.name}</h3>
              <div className="space-y-2">
                {${u.prefix}Courses.filter(x=>x.slug!==slug).slice(0,6).map(x=>(
                  <Link key={x.id} href={\`/universities/${u.slug}/courses/\${x.slug}\`}
                    className="block text-sm text-brand-700 hover:underline">
                    {x.name} →
                  </Link>
                ))}
              </div>
              <Link href="/universities/${u.slug}/courses" className="block text-xs text-gray-500 hover:underline mt-3">
                All ${u.name} programs →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content, 'utf8');
}

// ─── Universities.ts block writers ──────────────────────────────────────────

function buildUSANewBlock(unis) {
  const lines = ['// ── USA NEW universities (us11–us80) ──────────────────────'];
  for (const u of unis) {
    lines.push(`  {`);
    lines.push(`    id: '${u.id}', name: '${u.name.replace(/'/g,"\\'")}', slug: '${u.slug}',`);
    lines.push(`    country: 'USA', state: '${u.state}', city: '${u.city}',`);
    lines.push(`    qsRanking: ${u.qs}, annualTuitionUSD: ${u.tuition},`);
    lines.push(`    visaApprovalRate: ${u.qs <= 50 ? 85 : u.qs <= 200 ? 80 : u.qs <= 500 ? 76 : 72},`);
    lines.push(`    intakeMonths: ['August', 'January'],`);
    lines.push(`    requirements: { ieltsMin: ${u.ielts}, toeflMin: ${u.ielts >= 7.0 ? 100 : u.ielts >= 6.5 ? 90 : 80}, pteMin: ${u.ielts >= 7.0 ? 68 : u.ielts >= 6.5 ? 58 : 50} },`);
    lines.push(`    popularAmongIndians: ${['popular-indians','top-state'].includes(u.tier)},`);
    lines.push(`    establishedYear: ${u.slug.includes('state') ? 1870 : u.slug.includes('university-of') ? 1860 : 1885},`);
    lines.push(`    campusType: 'Urban',`);
    lines.push(`    totalStudents: ${u.qs <= 50 ? 12000 : u.qs <= 200 ? 18000 : 25000},`);
    lines.push(`    internationalStudents: ${u.qs <= 50 ? 3500 : u.qs <= 200 ? 4000 : 5000},`);
    lines.push(`    description: '${u.name} is a leading ${u.tier === 'ivy' ? 'private research' : 'public research'} university in ${u.city}, ${u.state}, USA. Recognized for academic excellence and strong industry connections, it offers world-class education to international students.',`);
    lines.push(`  },`);
  }
  return lines.join('\n');
}

function buildSGNewBlock(unis) {
  const lines = ['// ── Singapore NEW universities (sg03–sg15) ──────────────────────'];
  for (const u of unis) {
    const usdFee = Math.round(u.tuitionSGD * 0.74);
    lines.push(`  {`);
    lines.push(`    id: '${u.id}', name: '${u.name.replace(/'/g,"\\'")}', slug: '${u.slug}',`);
    lines.push(`    country: 'Singapore', state: 'Singapore', city: 'Singapore',`);
    lines.push(`    qsRanking: ${u.tier === 'sg-elite' ? 200 : u.tier === 'sg-intl' ? 500 : 999},`);
    lines.push(`    annualTuitionUSD: ${usdFee},`);
    lines.push(`    visaApprovalRate: ${u.tier === 'sg-elite' ? 88 : u.tier === 'sg-intl' ? 83 : 78},`);
    lines.push(`    intakeMonths: ['August', 'January'],`);
    lines.push(`    requirements: { ieltsMin: ${u.ielts}, toeflMin: ${u.ielts >= 7.0 ? 100 : u.ielts >= 6.5 ? 90 : 80}, pteMin: ${u.ielts >= 7.0 ? 68 : u.ielts >= 6.5 ? 58 : 50} },`);
    lines.push(`    popularAmongIndians: true,`);
    lines.push(`    establishedYear: 2000,`);
    lines.push(`    campusType: 'Urban',`);
    lines.push(`    totalStudents: ${u.tier === 'sg-elite' ? 30000 : u.tier === 'sg-intl' ? 8000 : 4000},`);
    lines.push(`    internationalStudents: ${u.tier === 'sg-elite' ? 8000 : u.tier === 'sg-intl' ? 3000 : 1500},`);
    lines.push(`    description: '${u.name} is a well-regarded institution in Singapore offering internationally recognised degrees. Popular among Indian students for its English-medium programs, multicultural campus, and post-study work options.',`);
    lines.push(`  },`);
  }
  return lines.join('\n');
}

// ─── Main ────────────────────────────────────────────────────────────────────

console.log('\n=== Generating USA + Singapore Universities ===\n');

// 1. USA Existing — course data + pages
console.log('--- USA Existing (course pages only) ---');
for (const u of USA_EXISTING) {
  const tuition = USA_EXISTING_TUITION[u.prefix];
  const courses = usaCourses(u, tuition);
  writeUSADataFile(u, courses);
  writeCoursesListPage(u, courses, 'USD');
  writeCourseDetailPage(u, 'USD');
}

// 2. USA New — data file + pages
console.log('\n--- USA New (80 universities) ---');
for (const u of USA_NEW) {
  const courses = usaCourses(u, u.tuition);
  writeUSADataFile(u, courses);
  writeCoursesListPage(u, courses, 'USD');
  writeCourseDetailPage(u, 'USD');
}

// 3. SG Existing — course data + pages
console.log('\n--- Singapore Existing (course pages only) ---');
for (const u of SG_EXISTING) {
  const tuition = SG_EXISTING_TUITION[u.prefix];
  const courses = sgCourses(u, tuition);
  writeSGDataFile(u, courses);
  writeCoursesListPage(u, courses, 'SGD');
  writeCourseDetailPage(u, 'SGD');
}

// 4. SG New — data file + pages
console.log('\n--- Singapore New (13 universities) ---');
for (const u of SG_NEW) {
  const courses = sgCourses(u, u.tuitionSGD);
  writeSGDataFile(u, courses);
  writeCoursesListPage(u, courses, 'SGD');
  writeCourseDetailPage(u, 'SGD');
}

// 5. Write universities.ts blocks
console.log('\n--- Writing universities.ts blocks ---');
fs.writeFileSync('scripts/usa-new-block.ts.txt', buildUSANewBlock(USA_NEW), 'utf8');
fs.writeFileSync('scripts/sg-new-block.ts.txt', buildSGNewBlock(SG_NEW), 'utf8');
console.log('  ✓ scripts/usa-new-block.ts.txt');
console.log('  ✓ scripts/sg-new-block.ts.txt');

const totalUni = USA_EXISTING.length + USA_NEW.length + SG_EXISTING.length + SG_NEW.length;
console.log(`\n✅ Done! Generated pages for ${totalUni} universities.`);
console.log('Next: node scripts/append-usa-sg-blocks.js');
