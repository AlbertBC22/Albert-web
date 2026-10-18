"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Registro único de plugins. Los componentes importan gsap desde aquí, nunca desde "gsap".
gsap.registerPlugin(useGSAP, ScrollTrigger, DrawSVGPlugin, SplitText);

export { gsap, useGSAP, ScrollTrigger, DrawSVGPlugin, SplitText };
