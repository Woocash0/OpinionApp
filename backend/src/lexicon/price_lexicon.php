<?php

$price_words = [
   //Pozytywne
   //-----------------------
   'affordable' => '1.0',                  // Przystępna
   'budget-friendly' => '1.0',             // Przyjazna dla budżetu
   'cost-effective' => '1.0',              // Opłacalna
   'economical' => '1.0',                  // Ekonomiczna
   'reasonable' => '1.0',                  // Rozsądna
   'inexpensive' => '1.0',                 // Niedroga
   'moderately priced' => '1.0',           // Średnio wyceniana
   'pocket-friendly' => '1.0',             // Przyjazna dla kieszeni
   'thrifty' => '1.0',                     // Oszczędna
   'value for money' => '1.5',             // Wartościowa w stosunku do ceny
   'bargain' => '1.0',                     // Okazja
   'cheap' => '1.0',                       // Tani
   'competitive' => '1.0',                 // Konkurencyjna
   'fair-priced' => '1.0',                 // Fair
   'low-cost' => '1.0',                    // Niskokosztowa
   'attractive' => '1.0',                  // Atrakcyjna
   'economy' => '1.0',                     // Ekonomiczna
   'wallet-friendly' => '1.0',             // Przyjazna portfelowi
   'discounted' => '1.0',                  // Przeceniona
   'reasonably priced' => '1.0',           // Rozsądnie wyceniona
   'cost-efficient' => '1.0',              // Wydajna kosztowo
   'cost-saving' => '1.0',                 // Oszczędzająca koszty
   'economic' => '1.0',                    // Ekonomiczna
   'frugal' => '1.0',                      // Oszczędna
   'discount' => '1.0',                    // Zniżka
   'sale' => '1.0',                        // Wyprzedaż
   'cut-rate' => '1.0',                    // Obniżona cena
   'reduced' => '1.0',                     // Obniżona
   'marked down' => '1.0',                 // Oznaczona niższą ceną
   'savings' => '1.0',                     // Oszczędności
   'bargainous' => '1.0',                  // Okazyjna
   'cut-price' => '1.0',                   // Obniżona cena
   'low-priced' => '1.0',                  // Nisko wyceniona
   'affordability' => '1.0',               // Dostępność cenowa
   'inexpensively' => '1.0',               // Niedrogo
   'sale-priced' => '1.0',                 // W przecenie
   'reasonability' => '1.0',               // Rozsądność cenowa
   'rock-bottom' => '1.0',                 // Najniższa możliwa cena
   'unbeatable' => '2.0',                  // Nie do pobicia
   'accessible' => '1.0',                  // Dostępna
   'approachable' => '1.0',                // Dostępna
   'available' => '1.0',                   // Dostępna
   'manageable' => '1.0',                  // Zarządzalna
   'fair' => '1.0',                        // Sprawiedliwa
   'just' => '1.0',                        // Tylko
   'tolerable' => '1.0',                   // Dopuszczalna
   'bearable' => '1.0',                    // Znośna
   'good value' => '1.5',                  // Dobry stosunek jakości do ceny
   'sensible' => '1.0',                    // Rozsądna
   'penny-wise' => '1.0',                  // Oszczędny
   'pocket-saving' => '1.0',               // Oszczędzający kieszonkowe
   'cost-conscious' => '1.0',              // Świadoma kosztów
   'money-saving' => '1.0',                // Oszczędzająca pieniądze
   'discounted' => '1.0',                  // Przeceniona
   'reduced-price' => '1.0',               // Obniżona cena
   'cut-price' => '1.0',                   // Obniżona cena
   'inexpensive' => '1.0',                 // Niedroga
   'marked down' => '1.0',                 // Oznaczona niższą ceną
   'cost-efficient' => '1.0',              // Wydajna kosztowo
   'discount' => '1.0',                    // Zniżka
   'bargain' => '1.0',                     // Okazja
   'sale' => '1.0',                        // Wyprzedaż
   'economical' => '1.0',                  // Ekonomiczna
   'competitive' => '1.0',                 // Konkurencyjna
   'discounted' => '1.0',                  // Przeceniona
   'cost-saving' => '1.0',                 // Oszczędzająca koszty
   'value for money' => '1.5',             // Wartościowa w stosunku do ceny
   'cut-rate' => '1.0',                    // Obniżona cena
   'affordable' => '1.0',                  // Przystępna
   'low-priced' => '1.0',                  // Nisko wyceniona
   'reasonable' => '1.0',                  // Rozsądna
   'cost-effective' => '1.0',              // Opłacalna
   'bargain' => '1.0',                     // Okazja
   'economical' => '1.0',                  // Ekonomiczna
   'competitive' => '1.0',                 // Konkurencyjna
   //Negatywne
   //-------------------------------------------------------
   'expensive' => '-1.0',                  // Droga
   'overpriced' => '-1.5',                 // Zbyt droga
   'pricey' => '-1.0',                      // Kosztowna
   'costly' => '-1.0',                      // Kosztowna
   'high-priced' => '-1.0',                 // Wysoko wyceniona
   'premium' => '-1.0',                     // Premium
   'extravagant' => '-2.0',                 // Ekstrawagancka
   'outrageous' => '-2.0',                  // Skandaliczna
   'sky-high' => '-2.0',                    // Wysoko na niebie
   'unaffordable' => '-2.0',                // Nie do przecenienia
   'prohibitive' => '-2.0',                 // Wygórowana
   'exorbitant' => '-2.0',                  // Wygórowana
   'unreasonable' => '-1.5',                // Nierozsądna
   'unrealistic' => '-1.5',                 // Nierealistyczna
   'inflated' => '-1.5',                    // Nadmuchiwanie
   'overinflated' => '-1.5',                // Nadmiernie napompowane
   'cost-prohibitive' => '-2.0',            // Zabronione koszty
   'luxury' => '-1.0',                      // Luksusowa
   'extraneous' => '-1.0',                  // Zbędna
   'unattainable' => '-2.0',                // Nieosiągalna
   'uneconomical' => '-1.5',                // Niekonieczna
   'steep' => '-1.5',                       // Stroma
   'pricy' => '-1.0',                       // Kosztowna
   'dear' => '-1.0',                        // Droga
   'lavish' => '-1.0',                      // Hojna
   'high-end' => '-1.0',                    // Luksusowa
   'extravagance' => '-2.0',                // Ekstrawagancja
   'unjustifiable' => '-2.0',               // Niedopuszczalne
   'unwarranted' => '-1.5',                 // Nieuzasadnione
   'overboard' => '-1.5',                   // Przegiąć
   'over-the-top' => '-2.0',                // Przesadzone
   'outrageously' => '-2.0',                // Skandalicznie
   'inordinate' => '-1.5',                  // Nadmierne
   'unconscionable' => '-2.0',              // Niesprawiedliwe
   'excessive' => '-1.5',                   // Nadmierna
   'unreasonable' => '-1.5',                // Nierozsądne
   'impractical' => '-1.5',                 // Niepraktyczna
   'overdone' => '-1.5',                    // Przesadzone
   'over-the-top' => '-2.0',                // Przesadzone
   'disproportionate' => '-1.5',            // Niedopasowane
   'disproportionately' => '-1.5',          // Niedopasowanie
   'extortionate' => '-2.0',                // Wygórowane
   'unjustified' => '-2.0',                 // Nieuzasadnione
   'unmerited' => '-1.5',                   // Niewsparte
   'unfair' => '-1.5',                      // Niesprawiedliwe
   'unjust' => '-1.5',                      // Niesprawiedliwe
   'unwarrantable' => '-1.5',               // Nieuzasadniona
   'absurd' => '-2.0',                      // Absurdalna
   'outrage' => '-2.0',                     // Skandal
   'ridiculous' => '-2.0',                  // Śmieszne
   'unthinkable' => '-1.5',                 // Niewyobrażalne
   'unbelievable' => '-1.5',                // Niewiarygodne
   'unimaginable' => '-1.5',                // Nie do pomyślenia
   'unthinkable' => '-1.5',                 // Niewyobrażalne
   'unfathomable' => '-1.5',                // Nieprzeniknione
   'inconceivable' => '-1.5',               // Niepojęte
   'unacceptably' => '-1.5',                // Niedopuszczalnie
   'grossly' => '-1.5',                     // Brutto
   'undue' => '-1.5',                       // Nieuzasadnione
   'unnecessary' => '-1.5',                 // Niepotrzebne
   'wasteful' => '-1.5',                    // Marnotrawstwo
   'overkill' => '-1.5',                    // Przesada
   'unjustifiable' => '-2.0',               // Niedopuszczalne
   'overinflated' => '-1.5',                // Nadmieniona
   'exaggerated' => '-1.5',                 // Wyolbrzymiony
   'overrated' => '-1.5',                   // Przereklamowana
   'inflated' => '-1.5',                    // Nadmuchana
   'hyperbolic' => '-1.5',                  // Hiperboliczna
   'inflated' => '-1.5',                    // Nadmieniona
   'exaggerated' => '-1.5',                 // Wyolbrzymiony
   'dissapointing' => '-1.5'
];

?>