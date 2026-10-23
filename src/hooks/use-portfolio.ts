import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { defaultPortfolioData, PortfolioData } from "@/data/portfolio";
import {
  fetchPortfolioData,
  updateProjectsApi,
  updateCertificatesApi,
  updateSkillsApi,
  updateAboutApi,
  updateSocialsApi,
  resetPortfolioApi,
} from "@/lib/supabase";

export const PORTFOLIO_QUERY_KEY = ["portfolio-data"] as const;

export function usePortfolioData() {
  return useQuery<PortfolioData>({
    queryKey: PORTFOLIO_QUERY_KEY,
    queryFn: fetchPortfolioData,
    initialData: defaultPortfolioData,
    staleTime: 1000 * 30,
  });
}

export function usePortfolioMutations() {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: PORTFOLIO_QUERY_KEY });
  };

  const updateProjects = useMutation({
    mutationFn: updateProjectsApi,
    onSuccess: invalidate,
  });

  const updateCertificates = useMutation({
    mutationFn: updateCertificatesApi,
    onSuccess: invalidate,
  });

  const updateSkills = useMutation({
    mutationFn: updateSkillsApi,
    onSuccess: invalidate,
  });

  const updateAbout = useMutation({
    mutationFn: updateAboutApi,
    onSuccess: invalidate,
  });

  const updateSocials = useMutation({
    mutationFn: ({ socialLinks, location }: { socialLinks: PortfolioData["socialLinks"]; location?: string }) =>
      updateSocialsApi(socialLinks, location),
    onSuccess: invalidate,
  });

  const resetPortfolio = useMutation({
    mutationFn: resetPortfolioApi,
    onSuccess: invalidate,
  });

  return {
    updateProjects,
    updateCertificates,
    updateSkills,
    updateAbout,
    updateSocials,
    resetPortfolio,
  };
}
