export interface Paragraph {
  id: string;
  text: string;
}

export interface Segment {
  id: number;
  title: string;
  subtitle: string;
  paragraphs: Paragraph[];
}

export const SEGMENTS: Segment[] = [
  {
    id: 1,
    title: "Section 8.3. Type One and Type Two error.",
    subtitle: "The 2×2 Decision Matrix & Two True States",
    paragraphs: [
      {
        id: "seg1-p1",
        text: "Section 8.3. Type One and Type Two error."
      },
      {
        id: "seg1-p2",
        text: "A Type One error is rejecting the null hypothesis when it is true: concluding there is an effect when there is none. A Type Two error is failing to reject the null hypothesis when it is false: missing an effect that exists."
      },
      {
        id: "seg1-p3",
        text: "A test is a decision made from one sample, so it can go wrong in two ways. Cross the two true states — the null hypothesis true, or the null hypothesis false — with the two decisions — reject, or do not reject — and you get a two-by-two table."
      },
      {
        id: "seg1-p4",
        text: "Reject the null hypothesis when it is true: a Type One error, with probability alpha. Reject it when it is false: correct, with probability one minus beta — the power. Do not reject it when it is true: correct, with probability one minus alpha. Do not reject it when it is false: a Type Two error, with probability beta."
      }
    ]
  },
  {
    id: 2,
    title: "Figure 8.1 Sampling Distributions",
    subtitle: "Urban–Rural Mean Weight Difference (SE = 0.406 kg)",
    paragraphs: [
      {
        id: "seg2-p1",
        text: "Figure 8.1 draws these two columns as two sampling distributions of the urban–rural difference in mean weight from Chapter 7, both with a standard error of zero point four zero six kilograms. If the null hypothesis is true, the observed difference centres on zero. If the true difference is one kilogram, it centres on one."
      },
      {
        id: "seg2-p2",
        text: "A two-sided test at alpha equal to zero point zero five rejects the null hypothesis when the observed difference lies beyond plus or minus one point nine six times zero point four zero six — that is, beyond plus or minus zero point eight zero kilograms."
      },
      {
        id: "seg2-p3",
        text: "The tails of the first curve, beyond the cut-offs, are the Type One error: the chance, under the null hypothesis, of landing beyond the cut-offs — zero point zero two five in each tail. The area of the second curve between the cut-offs is the Type Two error: the chance, when the truth is one kilogram, of landing inside them. Here beta is zero point three one, so the power is zero point six nine."
      }
    ]
  },
  {
    id: 3,
    title: "Clinical Trial Decision Trade-offs & Standard Error",
    subtitle: "Approving useless vs abandoning useful drugs & the √n lever",
    paragraphs: [
      {
        id: "seg3-p1",
        text: "Testing a new drug against the null hypothesis of no effect: a Type One error means approving a useless drug; a Type Two error means abandoning a useful one. The two errors often differ in cost, which is why the choice of alpha is a judgement, not a law. Move the cut-offs outwards — a smaller alpha — and the Type One tails shrink while the Type Two area grows."
      },
      {
        id: "seg3-p2",
        text: "For a fixed sample size and design, lowering alpha raises beta. To lower both, you must shrink the standard error. For a given design and variability, the main lever is sample size: the standard error falls with the square root of n. A paired or matched design, or a more precise measurement, also lowers the standard error, and so reduces both errors."
      }
    ]
  },
  {
    id: 4,
    title: "Section 8.4. Significance level and power.",
    subtitle: "Alpha choice, Cohen's d, and Fisher's 1925 convention",
    paragraphs: [
      {
        id: "seg4-p1",
        text: "Section 8.4. Significance level and power."
      },
      {
        id: "seg4-p2",
        text: "The significance level, alpha, is the probability of a Type One error that the researcher accepts, fixed before the data are seen. Power, one minus beta, is the probability that the test rejects the null hypothesis when a specified true effect exists. An effect size is the magnitude of the effect or association being studied. A raw effect size is on the outcome's own scale: a difference in means in kilograms, a risk difference, a risk ratio. A standardised effect size divides a difference by a standard deviation, which makes it unit-free; for two means it is Cohen's d, the difference in means divided by the pooled standard deviation."
      },
      {
        id: "seg4-p3",
        text: "Alpha is chosen by the researcher: \"I accept rejecting a true null hypothesis this often, and no more.\" Power is the other side of the Type Two error rate: the chance that the study will find an effect of a stated size if it is there. Power always refers to a stated effect size, so the effect size must be defined first. A confidence interval is not an effect size. It is an interval estimate of an effect size, showing how precisely the effect has been measured."
      },
      {
        id: "seg4-p4",
        text: "Alpha equal to zero point zero five is a convention. Fisher, in 1925, called P equal to zero point zero five \"convenient to take as a limit\", and it has been the usual default since."
      }
    ]
  },
  {
    id: 5,
    title: "Urban–Rural Power Scenarios & 80% Power Planning",
    subtitle: "The 4 levers of power and the 63 children per group calculation",
    paragraphs: [
      {
        id: "seg5-p1",
        text: "For the urban–rural comparison, the raw effect size is one kilogram, and the standardised effect size, d, is zero point five three. The power for a true one-kilogram difference at alpha zero point zero five is zero point six nine. For a true difference of zero point five kilograms, the power is zero point two three: the same study would miss a half-kilogram difference more than three times in four. Doubling both groups raises the power for one kilogram to zero point nine four. Tightening alpha to zero point zero one, with the original groups, lowers it to zero point four six."
      },
      {
        id: "seg5-p2",
        text: "So beta is not one number: it depends on the true effect. Power depends on four things: sample size, alpha, the true effect size, and the variability of the data. A larger n, a larger alpha, a larger effect or a smaller standard deviation each raise power."
      },
      {
        id: "seg5-p3",
        text: "Eighty percent power is also a convention. Cohen, in 1992, proposed zero point eight zero \"for general use\"; the ICH E9 guideline notes that the Type Two error is conventionally set at ten to twenty percent — power of eighty to ninety percent. For planning: with equal groups, a standard deviation of two kilograms, and a one-kilogram difference to detect, sixty-three children per group give eighty percent power by the normal formula; sixty-four by the slightly more exact calculation that software does."
      }
    ]
  },
  {
    id: 6,
    title: "Inconclusive Results & The Post-Hoc Power Fallacy",
    subtitle: "Ambiguity of small studies and why observed power is circular",
    paragraphs: [
      {
        id: "seg6-p1",
        text: "A non-significant result from a small study is ambiguous. There may be no effect, or the study may have been too small to detect one. The confidence interval shows which: a wide interval that includes clinically important effects means \"inconclusive\", not \"no effect\"."
      },
      {
        id: "seg6-p2",
        text: "A common misreading: \"The result was not significant, so we calculated the power from our observed effect, and it was low.\" This observed, or post-hoc, power adds nothing. It is a one-to-one function of the p-value. At p equal to zero point zero five, observed power is exactly zero point five zero; at p equal to zero point two zero, it is zero point two five. Any result with p above zero point zero five has observed power below about fifty percent, by arithmetic alone. Power is a planning quantity, computed before the study for an effect size chosen as clinically important. After the study, report the effect estimate with its confidence interval."
      }
    ]
  }
];
