import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/shadcn/card";
import { Separator } from "@/components/ui/shadcn/separator";
import {
  ArrowLeft,
  Vote,
  Wallet,
  Shield,
  Gavel,
  UserCheck,
  HelpCircle,
  Blocks,
  Scale,
  Workflow,
  Eye,
  Key,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "@/governance/hooks/use-translation";

const SECTION_ICONS: Record<string, React.ElementType> = {
  gettingStarted: Wallet,
  governanceWorkflow: Workflow,
  instructionEventTypes: Vote,
  eventCategories: Gavel,
  hodlerSubmitted: UserCheck,
  quorumAndApproval: Scale,
  liquidNetwork: Blocks,
  onChainDetails: Eye,
  gaidAndWallets: Key,
  securityPrivacy: Shield,
};

export function FaqPage() {
  const { t } = useTranslation();

  const sectionKeys = Object.keys(t.faq.sections) as Array<keyof typeof t.faq.sections>;

  return (
    <div className="relative">
      <div className="absolute inset-0 grid-bg pointer-events-none" />

      <div className="relative max-w-4xl">
        <Link
          to="/otc-uat/governance"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.common.backToDashboard}
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-2xl font-bold font-mono">
              {t.faq.title}
            </h1>
            <p className="text-muted-foreground mt-2 max-w-2xl">
              {t.faq.subtitle}
            </p>
          </div>

          {/* Execution disclaimer */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm text-muted-foreground">
                {t.disclaimers.execution}
              </p>
              <p className="text-sm text-muted-foreground">
                {t.disclaimers.omnibusVsAllocation}
              </p>
            </CardContent>
          </Card>

          {/* Quick links */}
          <div className="flex flex-wrap gap-2">
            {sectionKeys.map((key) => {
              const Icon = SECTION_ICONS[key] ?? HelpCircle;
              const sectionTitle = t.faq.sections[key];
              return (
                <a
                  key={key}
                  href={`#${sectionTitle.toLowerCase().replace(/\s+/g, "-")}`}
                  className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/30 transition-colors"
                >
                  <Icon className="h-3 w-3" />
                  {sectionTitle}
                </a>
              );
            })}
          </div>

          <Separator />

          {/* FAQ sections */}
          {sectionKeys.map((key, sectionIdx) => {
            const SectionIcon = SECTION_ICONS[key] ?? HelpCircle;
            const sectionTitle = t.faq.sections[key];
            const questions = t.faq.qs[key] ?? {};
            return (
              <motion.div
                key={key}
                id={sectionTitle.toLowerCase().replace(/\s+/g, "-")}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: sectionIdx * 0.05 }}
                className="scroll-mt-24"
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                        <SectionIcon className="h-4 w-4 text-primary" />
                      </div>
                      {sectionTitle}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {Object.entries(questions).map(([question, answer], i, arr) => (
                      <div key={i} className="space-y-2">
                        <h3 className="text-sm font-semibold flex items-start gap-2">
                          <HelpCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          {question}
                        </h3>
                        <p className="text-sm text-muted-foreground pl-6 leading-relaxed">
                          {answer}
                        </p>
                        {i < arr.length - 1 && (
                          <Separator className="mt-4" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}

          {/* Bottom disclaimer */}
          <p className="text-xs text-muted-foreground/60 text-center max-w-2xl mx-auto">
            {t.disclaimers.footer}
          </p>

          {/* Bottom CTA */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6">
              <div className="space-y-1 text-center sm:text-left">
                <p className="font-semibold">{t.faq.readyToParticipate}</p>
                <p className="text-sm text-muted-foreground">
                  {t.faq.readyDesc}
                </p>
              </div>
              <Link
                to="/otc-uat/governance"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <Vote className="h-4 w-4" />
                {t.faq.goToDashboard}
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
