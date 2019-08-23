package com.kraken.analysis.properties;

import com.kraken.tools.configuration.properties.ApplicationProperties;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Slf4j
@Configuration
public class AnalysisPropertiesConfiguration {

  @Autowired
  @Bean
  AnalysisProperties gatlingProperties(final ApplicationProperties applicationProperties,
                                       @Value("${kraken.analysis.results.root:#{environment.KRAKEN_ANALYSIS_RESULTS_ROOT}}") final String resultsRoot) {
    final var root = applicationProperties.getData().resolve(resultsRoot).toString();
    log.info("Results root is set to " + root);

    return AnalysisProperties.builder()
        .resultsRoot(root)
        .build();
  }
}