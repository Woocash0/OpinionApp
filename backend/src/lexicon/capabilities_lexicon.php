<?php

$capabilities_words = [
   //Pozytywne
   //-----------------------
   'smooth' => '1.5',                       // Gładki
   'adaptable' => '1.5',                    // Adaptowalny
   'advanced' => '2.0',                     // Zaawansowany
   'agile' => '2.0',                        // Zwinny
   'all-in-one' => '2.0',                   // Wszystko w jednym
   'amazing' => '2.0',                      // Niesamowity
   'astounding' => '2.0',                   // Zdumiewający
   'astonishing' => '2.0',                  // Zaskakujący
   'beneficial' => '1.5',                   // Korzystny
   'brilliant' => '2.0',                    // Błyskotliwy
   'capable' => '1.5',                      // Zdolny
   'clever' => '1.5',                       // Sprytny
   'comprehensive' => '2.0',                // Kompleksowy
   'convenient' => '1.5',                   // Wygodny
   'customizable' => '1.5',                 // Dostosowywalny
   'cutting-edge' => '2.0',                 // Nowatorski
   'dependable' => '1.5',                   // Niezawodny
   'dynamic' => '1.5',                      // Dynamiczny
   'effective' => '1.5',                    // Efektywny
   'efficient' => '2.0',                    // Wydajny
   'empowering' => '2.0',                   // Wzmacniający
   'exceptional' => '2.0',                  // Wyjątkowy
   'extraordinary' => '2.0',                // Niezwykły
   'fantastic' => '2.0',                    // Fantastyczny
   'feature-rich' => '2.0',                 // Bogaty w funkcje
   'flexible' => '1.5',                     // Elastyczny
   'flawless' => '2.0',                     // Bezbłędny
   'functional' => '1.0',                   // Funkcjonalny
   'genius' => '2.0',                       // Genialny
   'handy' => '1.0',                        // Poręczny
   'helpful' => '1.5',                      // Pomocny
   'high-performance' => '2.0',             // Wysokowydajny
   'impactful' => '2.0',                    // Wpływowy
   'impressive' => '2.0',                   // Imponujący
   'innovative' => '2.0',                   // Innowacyjny
   'intelligent' => '2.0',                  // Inteligentny
   'intuitive' => '1.5',                    // Intuicyjny
   'invaluable' => '2.0',                   // Bezcenny
   'magnificent' => '2.0',                  // Wspaniały
   'modern' => '1.5',                       // Nowoczesny
   'multi-functional' => '2.0',             // Wielofunkcyjny
   'optimal' => '1.5',                      // Optymalny
   'outstanding' => '2.0',                  // Wybitny
   'perfect' => '2.0',                      // Doskonały
   'phenomenal' => '2.0',                   // Fenomenalny
   'positive' => '1.5',                     // Pozytywny
   'powerful' => '2.0',                     // Potężny
   'practical' => '1.5',                    // Praktyczny
   'productive' => '1.5',                   // Produktywny
   'progressive' => '1.5',                  // Progresywny
   'reliable' => '1.5',                     // Solidny
   'remarkable' => '2.0',                   // Niezwykły
   'resourceful' => '1.5',                  // Pomysłowy
   'revolutionary' => '2.0',                // Rewolucyjny
   'robust' => '1.5',                       // Solidny
   'satisfactory' => '1.0',                 // Satysfakcjonujący
   'seamless' => '2.0',                     // Bezproblemowy
   'sensible' => '1.0',                     // Sensowny
   'smart' => '1.5',                        // Inteligentny
   'solid' => '1.5',                        // Solidny
   'spectacular' => '2.0',                  // Spektakularny
   'splendid' => '2.0',                     // Wspaniały
   'stellar' => '2.0',                      // Gwiazdorski
   'superb' => '2.0',                       // Wyśmienity
   'supportive' => '1.5',                   // Wspierający
   'supreme' => '2.0',                      // Najwyższy
   'sustainable' => '1.5',                  // Zrównoważony
   'tailored' => '1.5',                     // Dopasowany
   'top-notch' => '2.0',                    // Najwyższej jakości
   'transformative' => '2.0',               // Przeobrażający
   'trustworthy' => '1.5',                  // Godny zaufania
   'ultimate' => '2.0',                     // Ostateczny
   'unbeatable' => '2.0',                   // Nie do pokonania
   'unique' => '2.0',                       // Unikalny
   'unmatched' => '2.0',                    // Niezrównany
   'unparalleled' => '2.0',                 // Niezrównany
   'unprecedented' => '2.0',                // Bezprecedensowy
   'user-friendly' => '1.5',                // Przyjazny dla użytkownika
   'valuable' => '1.5',                     // Wartościowy
   'versatile' => '1.5',                    // Wszechstronny
   'visionary' => '2.0',                    // Wizjonerski
   'well-designed' => '1.5',                // Dobrze zaprojektowany
   'well-made' => '1.5',                    // Dobrze wykonany
   'well-rounded' => '1.5',                 // Wszechstronny
   'wonderful' => '2.0',                    // Cudowny
   'world-class' => '2.0',                  // Światowej klasy
   'worthwhile' => '1.5',                   // Warty zachodu
   'wow' => '2.0',                          // Wow
   'zero-defect' => '2.0',                  // Bez wad
   'cutting-edge' => '2.0',                 // Nowatorski
   'multi-purpose' => '2.0',                // Wielozadaniowy
   //Negatywne
   //-------------------------------------------------------------
   'inadequate' => '-2.0',                 // Niewystarczający
   'poor' => '-2.0',                       // Słaby
   'inefficient' => '-2.0',                // Niewydajny
   'limited' => '-1.5',                    // Ograniczony
   'unreliable' => '-2.0',                 // Niezawodny
   'slow' => '-1.5',                       // Wolny
   'complicated' => '-1.5',                // Skomplikowany
   'buggy' => '-2.0',                      // Pełen błędów
   'flawed' => '-2.0',                     // Wadliwy
   'unresponsive' => '-2.0',               // Nieodpowiadający
   'outdated' => '-2.0',                   // Przestarzały
   'ineffective' => '-2.0',                // Nieskuteczny
   'frustrating' => '-2.0',                // Frustrujący
   'awkward' => '-1.5',                    // Niezręczny
   'unintuitive' => '-2.0',                // Nieintuicyjny
   'confusing' => '-2.0',                  // Dezorientujący
   'unstable' => '-2.0',                   // Niestabilny
   'unpredictable' => '-1.5',              // Nieprzewidywalny
   'basic' => '-1.0',                      // Podstawowy
   'restrictive' => '-1.5',                // Ograniczający
   'unadaptable' => '-2.0',                // Nieadaptowalny
   'unhelpful' => '-2.0',                  // Niepomocny
   'limited-use' => '-1.5',                // Ograniczone zastosowanie
   'glitchy' => '-2.0',                    // Wadliwy
   'counterintuitive' => '-2.0',           // Sprzeczny z intuicją
   'tedious' => '-1.5',                    // Żmudny
   'unfit' => '-2.0',                      // Niewłaściwy
   'obsolete' => '-2.0',                   // Przestarzały
   'underperforming' => '-2.0',            // Niedziałający zgodnie z oczekiwaniami
   'substandard' => '-2.0',                // Poniżej standardu
   'annoying' => '-2.0',                   // Irytujący
   'mediocre' => '-1.5',                   // Przeciętny
   'inferior' => '-2.0',                   // Gorszy
   'nonfunctional' => '-2.0',              // Niefunkcjonalny
   'unworkable' => '-2.0',                 // Niewykonalny
   'disappointing' => '-2.0',              // Rozczarowujący
   'clunky' => '-2.0',                     // Toporny
   'inept' => '-2.0',                      // Niezaradny
   'inconsistent' => '-2.0',               // Niespójny
   'lacking' => '-2.0',                    // Brakujący
   'unsatisfactory' => '-2.0',             // Niezadowalający
   'laborious' => '-1.5',                  // Pracochłonny
   'ineffectual' => '-2.0',                // Nieudolny
   'cumbersome' => '-1.5',                 // Niewygodny
   'subpar' => '-1.5',                     // Poniżej normy
   'defective' => '-2.0',                  // Wadliwy
   'unfavorable' => '-2.0',                // Niekorzystny
   'troublesome' => '-1.5',                // Kłopotliwy
   'fragile' => '-1.5',                    // Kruchy
   'inconvenient' => '-1.5',               // Niewygodny
   'unfriendly' => '-1.5',                 // Nieprzyjazny
   'painstaking' => '-1.5',                // Mozolny
   'underwhelming' => '-2.0',              // Rozczarowujący
   'incompetent' => '-2.0',                // Niekompetentny
   'lackluster' => '-1.5',                 // Niewyróżniający się
   'burdensome' => '-1.5',                 // Uciążliwy
   'nonviable' => '-2.0',                  // Nieopłacalny
   'inflexible' => '-1.5',                 // Niewygodny
   'shortcoming' => '-2.0',                // Brak
   'rudimentary' => '-1.0',                // Podstawowy
   'insufficient' => '-2.0',               // Niewystarczający
   'difficult' => '-1.5',                  // Trudny
   'hampered' => '-1.5',                   // Utrudniony
   'rudimentary' => '-1.5',                // Podstawowy
   'sluggish' => '-1.5',                   // Powolny
   'unrefined' => '-1.5',                  // Niewyrafinowany
   'primitive' => '-1.0',                  // Prymitywny
   'flimsy' => '-1.5',                     // Nietrwały
   'faulty' => '-2.0',                     // Wadliwy
   'bare-bones' => '-1.0',                 // Podstawowy
   'minimal' => '-1.0',                    // Minimalny
   'crude' => '-1.5',                      // Prymitywny
   'basic' => '-1.0',                      // Podstawowy
   'scanty' => '-1.5',                     // Skąpy
   'fragmented' => '-1.5',                 // Fragmentaryczny
   'unimpressive' => '-1.5',               // Nieimponujący
   'rudimentary' => '-1.0',                // Podstawowy
   'meager' => '-1.5',                     // Skąpy
   'dissatisfactory' => '-2.0',            // Niezadowalający
   'sketchy' => '-1.5',                    // Podejrzany
   'untrustworthy' => '-1.5',              // Niegodny zaufania
   'amateurish' => '-1.5',                 // Amatorski
   'unsophisticated' => '-1.5',            // Nieskomplikowany
   'choppy' => '-1.5',                     // Nierówny
   'mediocre' => '-1.5',                   // Przeciętny
   'negligible' => '-1.5',                  // Znikomy
   'laggy' => '-2.0',
   'unusable' => '-2.0',
   'lasts only' => '-2.0',
   'dissapointing' => '-1.5'
];

?>